"use client";

import { useEffect, useState } from "react";
import {
  Home,
  Search,
  Bell,
  MessageCircle,
  Users,
  User,
  Settings,
  LogOut,
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  Send,
  UserPlus,
  Check,
  Menu,
  X,
  Lock,
  Mail,
  AtSign,
  Camera,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "../lib/supabase-browser";

const supabase = createClient();

/* =========================================
   بيانات تجريبية للواجهة
========================================= */

const demoStories = [
  {
    id: 1,
    name: "Mizo",
    image: "https://i.pravatar.cc/300?img=12",
  },
  {
    id: 2,
    name: "Kanao",
    image: "https://i.pravatar.cc/300?img=47",
  },
  {
    id: 3,
    name: "Sakura",
    image: "https://i.pravatar.cc/300?img=32",
  },
  {
    id: 4,
    name: "Yuki",
    image: "https://i.pravatar.cc/300?img=44",
  },
  {
    id: 5,
    name: "Mariam",
    image: "https://i.pravatar.cc/300?img=25",
  },
];

const demoSuggestions = [
  {
    id: 1,
    name: "Kanao Tsuyuri",
    username: "kanao",
    image: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: 2,
    name: "Mizo",
    username: "mizo",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 3,
    name: "Sakura",
    username: "sakura",
    image: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: 4,
    name: "Yuki",
    username: "yuki",
    image: "https://i.pravatar.cc/150?img=44",
  },
];

/* =========================================
   الصفحة الرئيسية
========================================= */

export default function HomePage() {
  /* ---------------------------------------
     Auth
  --------------------------------------- */

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const [authMode, setAuthMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [authMessage, setAuthMessage] = useState("");
  const [authSuccess, setAuthSuccess] = useState(false);

  /* ---------------------------------------
     App
  --------------------------------------- */

  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");

  const [search, setSearch] = useState("");

  const [likedPosts, setLikedPosts] = useState({});
  const [commentText, setCommentText] = useState({});
  const [comments, setComments] = useState({});

  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  /* =========================================
     فحص تسجيل الدخول
  ========================================= */

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        /*
         * إذا فتح المستخدم:
         *
         * /?logout=1
         *
         * سيتم حذف الجلسة وإظهار شاشة الدخول.
         */

        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);

          if (params.get("logout") === "1") {
            await supabase.auth.signOut({ scope: "local" });

            if (mounted) {
              setUser(null);
              setProfile(null);
              setLoading(false);
            }

            window.history.replaceState({}, "", "/");
            return;
          }
        }

        /*
         * getUser يتحقق من المستخدم الحالي
         * بدل الاعتماد فقط على البيانات المخزنة.
         */

        const { data, error } = await supabase.auth.getUser();

        if (!mounted) return;

        if (error || !data?.user) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setUser(data.user);

        await loadProfile(data.user);
        await loadPosts(data.user);

        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);

        if (mounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    }

    initializeAuth();

    /*
     * مراقبة تسجيل الدخول والخروج
     */

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (
        event === "SIGNED_OUT" ||
        !session?.user
      ) {
        setUser(null);
        setProfile(null);
        setPosts([]);
        setLoading(false);
        return;
      }

      if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "INITIAL_SESSION" ||
        event === "USER_UPDATED"
      ) {
        setUser(session.user);

        await loadProfile(session.user);
        await loadPosts(session.user);

        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* =========================================
     تحميل البروفايل
  ========================================= */

  async function loadProfile(currentUser) {
    if (!currentUser?.id) return null;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (error) {
        console.error("Profile load error:", error);
        return null;
      }

      if (data) {
        setProfile(data);

        await supabase
          .from("profiles")
          .update({
            is_online: true,
            last_seen: new Date().toISOString(),
          })
          .eq("id", currentUser.id);

        return data;
      }

      /*
       * إذا لم يوجد profile ننشئه.
       */

      const meta = currentUser.user_metadata || {};

      const fallbackUsername =
        meta.username ||
        currentUser.email?.split("@")[0] ||
        `user_${currentUser.id.slice(0, 8)}`;

      const fallbackDisplayName =
        meta.display_name ||
        fallbackUsername;

      const newProfile = {
        id: currentUser.id,
        username: fallbackUsername,
        display_name: fallbackDisplayName,
        email: currentUser.email || null,
        bio: "",
        avatar_url: null,
        cover_url: null,
        is_online: true,
        last_seen: new Date().toISOString(),
      };

      const { data: created, error: createError } = await supabase
        .from("profiles")
        .insert(newProfile)
        .select()
        .single();

      if (createError) {
        console.error("Profile create error:", createError);
        return null;
      }

      setProfile(created);

      return created;
    } catch (error) {
      console.error("Profile error:", error);
      return null;
    }
  }

  /* =========================================
     تحميل المنشورات
  ========================================= */

  async function loadPosts() {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (
            id,
            username,
            display_name,
            avatar_url
          )
        `)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error("Posts error:", error);
        setPosts([]);
        return;
      }

      const realPosts = (data || []).map((post) => ({
        ...post,
        isDemo: false,
      }));

      setPosts(realPosts);
    } catch (error) {
      console.error("Load posts error:", error);
      setPosts([]);
    }
  }

  /* =========================================
     تسجيل الدخول / التسجيل
  ========================================= */

  async function handleAuth(event) {
    event.preventDefault();

    setAuthMessage("");
    setAuthSuccess(false);

    if (!email.trim()) {
      setAuthMessage("اكتب البريد الإلكتروني.");
      return;
    }

    if (!password.trim()) {
      setAuthMessage("اكتب كلمة المرور.");
      return;
    }

    if (password.length < 6) {
      setAuthMessage(
        "كلمة المرور يجب أن تكون 6 أحرف على الأقل."
      );
      return;
    }

    if (
      authMode === "register" &&
      !username.trim()
    ) {
      setAuthMessage("اكتب اسم المستخدم.");
      return;
    }

    setAuthLoading(true);

    try {
      if (authMode === "register") {
        /*
         * التأكد من اسم المستخدم
         */

        const { data: existingUsername, error: usernameError } =
          await supabase
            .from("profiles")
            .select("id")
            .eq("username", username.trim())
            .maybeSingle();

        if (usernameError) {
          console.error(usernameError);
        }

        if (existingUsername) {
          setAuthMessage(
            "اسم المستخدم مستخدم بالفعل."
          );
          setAuthLoading(false);
          return;
        }

        /*
         * إنشاء حساب Supabase
         */

        const { data, error } =
          await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: {
                username: username.trim(),
                display_name:
                  displayName.trim() ||
                  username.trim(),
              },
            },
          });

        if (error) {
          setAuthMessage(error.message);
          setAuthLoading(false);
          return;
        }

        /*
         * إذا كان Supabase يحتاج تأكيد البريد
         */

        if (data?.user && !data?.session) {
          setAuthSuccess(true);
          setAuthMessage(
            "تم إنشاء الحساب. تحقق من بريدك الإلكتروني ثم سجل الدخول."
          );

          setAuthLoading(false);
          return;
        }

        /*
         * إذا تم إنشاء session مباشرة
         */

        if (data?.user) {
          setUser(data.user);

          await loadProfile(data.user);
          await loadPosts(data.user);

          setAuthSuccess(true);
          setAuthMessage("تم إنشاء الحساب بنجاح.");

          setTimeout(() => {
            setAuthMessage("");
          }, 1500);
        }
      } else {
        /*
         * تسجيل الدخول
         */

        const { data, error } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (error) {
          setAuthMessage(
            error.message ||
              "البريد الإلكتروني أو كلمة المرور غير صحيحة."
          );

          setAuthLoading(false);
          return;
        }

        if (!data?.user) {
          setAuthMessage(
            "لم يتم العثور على الحساب."
          );

          setAuthLoading(false);
          return;
        }

        setUser(data.user);

        await loadProfile(data.user);
        await loadPosts(data.user);

        setAuthSuccess(true);
        setAuthMessage("تم تسجيل الدخول بنجاح.");

        setTimeout(() => {
          setAuthMessage("");
        }, 1200);
      }
    } catch (error) {
      console.error(error);

      setAuthMessage(
        error?.message ||
          "حدث خطأ غير متوقع."
      );
    }

    setAuthLoading(false);
  }

  /* =========================================
     تسجيل الخروج
  ========================================= */

  async function logout() {
    try {
      await supabase.auth.signOut({
        scope: "local",
      });
    } catch (error) {
      console.error(error);
    }

    setUser(null);
    setProfile(null);
    setPosts([]);
    setLikedPosts({});
    setComments({});
    setCommentText({});
    setMobileMenu(false);

    /*
     * إعادة تحميل الصفحة للتأكد من تنظيف الحالة.
     */

    window.location.href = "/";
  }

  /* =========================================
     إنشاء منشور
  ========================================= */

  async function createPost() {
    if (!user) return;

    const content = postText.trim();

    if (!content) return;

    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        content,
      })
      .select(`
        *,
        profiles (
          id,
          username,
          display_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error(error);
      alert(
        "تعذر إنشاء المنشور: " +
          error.message
      );
      return;
    }

    if (data) {
      setPosts((current) => [
        {
          ...data,
          isDemo: false,
        },
        ...current,
      ]);
    }

    setPostText("");
  }

  /* =========================================
     إعجاب
  ========================================= */

  async function toggleLike(post) {
    if (!user || post.isDemo) {
      setLikedPosts((current) => ({
        ...current,
        [post.id]: !current[post.id],
      }));

      return;
    }

    const isLiked = likedPosts[post.id];

    if (isLiked) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", user.id);

      if (!error) {
        setLikedPosts((current) => ({
          ...current,
          [post.id]: false,
        }));
      }
    } else {
      const { error } = await supabase
        .from("likes")
        .insert({
          post_id: post.id,
          user_id: user.id,
        });

      if (!error) {
        setLikedPosts((current) => ({
          ...current,
          [post.id]: true,
        }));
      }
    }
  }

  /* =========================================
     تعليق
  ========================================= */

  async function addComment(post) {
    if (!user) return;

    const text = (
      commentText[post.id] || ""
    ).trim();

    if (!text) return;

    if (post.isDemo) {
      setComments((current) => ({
        ...current,
        [post.id]: [
          ...(current[post.id] || []),
          {
            id: Date.now(),
            content: text,
            profile: {
              display_name:
                profile?.display_name ||
                "أنت",
            },
          },
        ],
      }));

      setCommentText((current) => ({
        ...current,
        [post.id]: "",
      }));

      return;
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: post.id,
        user_id: user.id,
        content: text,
      })
      .select(`
        *,
        profiles (
          display_name,
          username,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setComments((current) => ({
        ...current,
        [post.id]: [
          ...(current[post.id] || []),
          data,
        ],
      }));
    }

    setCommentText((current) => ({
      ...current,
      [post.id]: "",
    }));
  }

  /* =========================================
     حذف منشور
  ========================================= */

  async function deletePost(post) {
    if (!user || post.isDemo) return;

    if (post.user_id !== user.id) {
      return;
    }

    const ok = window.confirm(
      "هل تريد حذف هذا المنشور؟"
    );

    if (!ok) return;

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id)
      .eq("user_id", user.id);

    if (error) {
      alert(
        "تعذر حذف المنشور: " +
          error.message
      );
      return;
    }

    setPosts((current) =>
      current.filter(
        (item) => item.id !== post.id
      )
    );

    setOpenMenu(null);
  }

  /* =========================================
     متابعة
  ========================================= */

  async function followUser(targetId) {
    if (!user || !targetId) return;

    if (targetId === user.id) return;

    const { error } = await supabase
      .from("follows")
      .insert({
        follower_id: user.id,
        following_id: targetId,
      });

    if (
      error &&
      !error.message?.toLowerCase().includes("duplicate")
    ) {
      console.error(error);
      return;
    }

    alert("تمت المتابعة.");
  }

  /* =========================================
     فلترة المنشورات
  ========================================= */

  const filteredPosts = posts.filter((post) => {
    if (!search.trim()) return true;

    const query = search
      .trim()
      .toLowerCase();

    const content =
      post.content?.toLowerCase() || "";

    const name =
      post.profiles?.display_name?.toLowerCase() ||
      "";

    const username =
      post.profiles?.username?.toLowerCase() ||
      "";

    return (
      content.includes(query) ||
      name.includes(query) ||
      username.includes(query)
    );
  });

  /* =========================================
     الاسم والصورة
  ========================================= */

  const currentName =
    profile?.display_name ||
    profile?.username ||
    user?.email?.split("@")[0] ||
    "مستخدم";

  const currentUsername =
    profile?.username ||
    user?.email?.split("@")[0] ||
    "user";

  /* =========================================
     Loading
  ========================================= */

  if (loading) {
    return (
      <div className="auth-loading">
        <div>
          <div
            className="auth-logo"
            style={{
              marginBottom: 20,
            }}
          >
            M
          </div>

          <div>
            جاري تحميل Mizo Social...
          </div>
        </div>
      </div>
    );
  }

  /* =========================================
     شاشة الدخول
  ========================================= */

  if (!user) {
    return (
      <main className="auth-screen">
        <div className="auth-card">
          <div className="auth-logo">
            M
          </div>

          <h1 className="auth-title">
            Mizo Social
          </h1>

          <p className="auth-subtitle">
            منصتك الاجتماعية الجديدة
            <br />
            شارك، تواصل، واكتشف أشخاصًا جدد
          </p>

          <div className="auth-tabs">
            <button
              type="button"
              className={
                authMode === "login"
                  ? "active"
                  : ""
              }
              onClick={() => {
                setAuthMode("login");
                setAuthMessage("");
                setAuthSuccess(false);
              }}
            >
              تسجيل الدخول
            </button>

            <button
              type="button"
              className={
                authMode === "register"
                  ? "active"
                  : ""
              }
              onClick={() => {
                setAuthMode("register");
                setAuthMessage("");
                setAuthSuccess(false);
              }}
            >
              إنشاء حساب
            </button>
          </div>

          <form
            className="auth-form"
            onSubmit={handleAuth}
          >
            {authMode === "register" && (
              <>
                <div className="auth-field">
                  <label>
                    اسم المستخدم
                  </label>

                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    <AtSign
                      size={18}
                      style={{
                        position: "absolute",
                        right: 15,
                        top: 15,
                        color: "#777",
                      }}
                    />

                    <input
                      type="text"
                      value={username}
                      onChange={(e) =>
                        setUsername(
                          e.target.value
                        )
                      }
                      placeholder="mizo"
                      style={{
                        paddingRight: 45,
                      }}
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label>
                    الاسم الظاهر
                  </label>

                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) =>
                      setDisplayName(
                        e.target.value
                      )
                    }
                    placeholder="اسمك"
                    autoComplete="name"
                  />
                </div>
              </>
            )}

            <div className="auth-field">
              <label>
                البريد الإلكتروني
              </label>

              <div
                style={{
                  position: "relative",
                }}
              >
                <Mail
                  size={18}
                  style={{
                    position: "absolute",
                    right: 15,
                    top: 15,
                    color: "#777",
                  }}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="example@email.com"
                  style={{
                    paddingRight: 45,
                  }}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>
                كلمة المرور
              </label>

              <div
                style={{
                  position: "relative",
                }}
              >
                <Lock
                  size={18}
                  style={{
                    position: "absolute",
                    right: 15,
                    top: 15,
                    color: "#777",
                  }}
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="••••••••"
                  style={{
                    paddingRight: 45,
                  }}
                  autoComplete={
                    authMode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  required
                />
              </div>
            </div>

            <button
              className="auth-submit"
              type="submit"
              disabled={authLoading}
            >
              {authLoading
                ? "جاري المعالجة..."
                : authMode === "login"
                ? "تسجيل الدخول"
                : "إنشاء الحساب"}
            </button>
          </form>

          {authMessage && (
            <div
              className={
                "auth-message " +
                (authSuccess
                  ? "auth-success"
                  : "")
              }
            >
              {authMessage}
            </div>
          )}

          <div className="auth-footer">
            <ShieldCheck
              size={14}
              style={{
                verticalAlign: "middle",
                marginLeft: 5,
              }}
            />
            حسابك محمي بواسطة Supabase
          </div>
        </div>
      </main>
    );
  }

  /* =========================================
     التطبيق بعد تسجيل الدخول
  ========================================= */

  return (
    <div className="social-app">
      {/* =====================================
          الشريط العلوي
      ===================================== */}

      <header className="topbar">
        <div className="logo">
          <div className="logo-icon">
            M
          </div>

          <span className="logo-text">
            Mizo Social
          </span>
        </div>

        <div className="search-box">
          <Search
            className="search-icon"
            size={19}
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="ابحث عن منشور أو شخص..."
          />
        </div>

        <div className="top-actions">
          <button
            className="icon-button relative"
            title="الإشعارات"
          >
            <Bell size={20} />

            <span className="notification-badge">
              3
            </span>
          </button>

          <button
            className="icon-button hide-mobile"
            title="الرسائل"
          >
            <MessageCircle size={20} />
          </button>

          <button
            className="icon-button"
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
          >
            {mobileMenu ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </header>

      {/* =====================================
          التخطيط
      ===================================== */}

      <main className="main-layout">
        {/* ===================================
            الجانب الأيسر
        =================================== */}

        <aside className="sidebar">
          <nav className="sidebar-menu">
            <a
              href="#home"
              className="menu-item active"
            >
              <Home size={20} />
              <span>الرئيسية</span>
            </a>

            <a
              href="#discover"
              className="menu-item"
            >
              <Sparkles size={20} />
              <span>اكتشف</span>
            </a>

            <a
              href="#messages"
              className="menu-item"
            >
              <MessageCircle size={20} />
              <span>الرسائل</span>
            </a>

            <a
              href="#friends"
              className="menu-item"
            >
              <Users size={20} />
              <span>الأصدقاء</span>
            </a>

            <a
              href="#profile"
              className="menu-item"
            >
              <User size={20} />
              <span>الملف الشخصي</span>
            </a>

            <button
              type="button"
              className="menu-item"
              onClick={logout}
              style={{
                border: 0,
                background: "transparent",
                width: "100%",
                textAlign: "right",
              }}
            >
              <LogOut size={20} />
              <span>تسجيل الخروج</span>
            </button>
          </nav>

          <div
            className="card side-card"
            style={{
              marginTop: 20,
            }}
          >
            <div className="side-title">
              حسابك
            </div>

            <div className="suggestion">
              <div className="avatar">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  currentName
                    .charAt(0)
                    .toUpperCase()
                )}
              </div>

              <div className="suggestion-info">
                <div className="suggestion-name">
                  {currentName}
                </div>

                <div className="suggestion-user">
                  @{currentUsername}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ===================================
            المحتوى الرئيسي
        =================================== */}

        <section className="feed">
          {/* Stories */}

          <div className="stories">
            {demoStories.map((story) => (
              <div
                className="story"
                key={story.id}
              >
                <img
                  src={story.image}
                  alt={story.name}
                />

                <div className="story-name">
                  {story.name}
                </div>
              </div>
            ))}
          </div>

          {/* إنشاء منشور */}

          <div className="card create-post">
            <div className="create-row">
              <div className="avatar">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  currentName
                    .charAt(0)
                    .toUpperCase()
                )}
              </div>

              <textarea
                value={postText}
                onChange={(e) =>
                  setPostText(
                    e.target.value
                  )
                }
                placeholder={`بماذا تفكر يا ${currentName}؟`}
                style={{
                  flex: 1,
                  minHeight: 70,
                  resize: "none",
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: 14,
                  background: "#14161d",
                  color: "white",
                  outline: "none",
                  padding: 13,
                }}
              />
            </div>

            <div className="post-tools">
              <button
                className="post-tool"
                type="button"
                onClick={() =>
                  alert(
                    "رفع الصور سيتم تفعيله مع Supabase Storage."
                  )
                }
              >
                <ImageIcon
                  size={17}
                  style={{
                    verticalAlign: "middle",
                    marginLeft: 6,
                  }}
                />
                صورة
              </button>

              <button
                className="post-tool"
                type="button"
                onClick={() =>
                  alert(
                    "رفع الفيديو سيتم تفعيله مع Supabase Storage."
                  )
                }
              >
                <Video
                  size={17}
                  style={{
                    verticalAlign: "middle",
                    marginLeft: 6,
                  }}
                />
                فيديو
              </button>

              <button
                className="post-tool"
                type="button"
                onClick={createPost}
              >
                <Send
                  size={17}
                  style={{
                    verticalAlign: "middle",
                    marginLeft: 6,
                  }}
                />
                نشر
              </button>
            </div>
          </div>

          {/* المنشورات */}

          {filteredPosts.length === 0 && (
            <div
              className="card"
              style={{
                padding: 35,
                textAlign: "center",
                color: "#858894",
              }}
            >
              لا توجد منشورات حاليًا.
              <br />
              كن أول شخص ينشر شيئًا!
            </div>
          )}

          {filteredPosts.map((post) => {
            const postProfile =
              post.profiles || {};

            const postName =
              postProfile.display_name ||
              postProfile.username ||
              "مستخدم";

            const postUsername =
              postProfile.username ||
              "user";

            const liked =
              !!likedPosts[post.id];

            const postComments =
              comments[post.id] || [];

            return (
              <article
                className="card post"
                key={post.id}
              >
                {/* Header */}

                <div className="post-header">
                  <div className="user-info">
                    <div className="avatar">
                      {postProfile.avatar_url ? (
                        <img
                          src={
                            postProfile.avatar_url
                          }
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius:
                              "50%",
                            objectFit:
                              "cover",
                          }}
                        />
                      ) : (
                        postName
                          .charAt(0)
                          .toUpperCase()
                      )}
                    </div>

                    <div>
                      <div className="user-name">
                        {postName}
                      </div>

                      <div className="post-time">
                        @{postUsername} ·{" "}
                        {formatDate(
                          post.created_at
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className="relative"
                    style={{
                      position: "relative",
                    }}
                  >
                    <button
                      className="post-menu"
                      onClick={() =>
                        setOpenMenu(
                          openMenu ===
                            post.id
                            ? null
                            : post.id
                        )
                      }
                    >
                      <MoreHorizontal
                        size={21}
                      />
                    </button>

                    {openMenu ===
                      post.id && (
                      <div
                        style={{
                          position:
                            "absolute",
                          top: 30,
                          left: 0,
                          width: 150,
                          padding: 7,
                          borderRadius: 13,
                          background:
                            "#181a22",
                          border:
                            "1px solid rgba(255,255,255,.08)",
                          boxShadow:
                            "0 15px 40px rgba(0,0,0,.45)",
                          zIndex: 20,
                        }}
                      >
                        {post.user_id ===
                          user?.id &&
                          !post.isDemo && (
                            <button
                              type="button"
                              onClick={() =>
                                deletePost(
                                  post
                                )
                              }
                              style={{
                                width:
                                  "100%",
                                border: 0,
                                background:
                                  "transparent",
                                color:
                                  "#f87171",
                                padding: 10,
                                textAlign:
                                  "right",
                                borderRadius: 9,
                              }}
                            >
                              حذف المنشور
                            </button>
                          )}

                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(
                              window.location
                                .href
                            );
                            setOpenMenu(
                              null
                            );
                          }}
                          style={{
                            width: "100%",
                            border: 0,
                            background:
                              "transparent",
                            color:
                              "#ddd",
                            padding: 10,
                            textAlign:
                              "right",
                            borderRadius: 9,
                          }}
                        >
                          نسخ الرابط
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}

                {post.content && (
                  <div className="post-content">
                    {post.content}
                  </div>
                )}

                {/* Image */}

                {post.image_url && (
                  <div className="post-media">
                    <img
                      src={post.image_url}
                      alt=""
                    />
                  </div>
                )}

                {/* Video */}

                {post.video_url && (
                  <div className="post-media">
                    <video
                      src={post.video_url}
                      controls
                    />
                  </div>
                )}

                {/* Stats */}

                <div className="post-stats">
                  <span>
                    {liked ? "❤️" : "♡"} إعجاب
                  </span>

                  <span>
                    {postComments.length} تعليق
                  </span>
                </div>

                {/* Actions */}

                <div className="post-actions">
                  <button
                    className={
                      "post-action " +
                      (liked
                        ? "liked"
                        : "")
                    }
                    type="button"
                    onClick={() =>
                      toggleLike(post)
                    }
                  >
                    <Heart
                      size={18}
                      fill={
                        liked
                          ? "currentColor"
                          : "none"
                      }
                      style={{
                        verticalAlign:
                          "middle",
                        marginLeft: 5,
                      }}
                    />

                    إعجاب
                  </button>

                  <button
                    className="post-action"
                    type="button"
                    onClick={() => {
                      const element =
                        document.getElementById(
                          `comment-${post.id}`
                        );

                      element?.focus();
                    }}
                  >
                    <MessageSquare
                      size={18}
                      style={{
                        verticalAlign:
                          "middle",
                        marginLeft: 5,
                      }}
                    />

                    تعليق
                  </button>

                  <button
                    className="post-action"
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        window.location.href
                      );

                      alert(
                        "تم نسخ رابط الموقع."
                      );
                    }}
                  >
                    <Share2
                      size={18}
                      style={{
                        verticalAlign:
                          "middle",
                        marginLeft: 5,
                      }}
                    />

                    مشاركة
                  </button>
                </div>

                {/* Comments */}

                {postComments.length > 0 && (
                  <div
                    style={{
                      marginTop: 14,
                      display: "flex",
                      flexDirection:
                        "column",
                      gap: 8,
                    }}
                  >
                    {postComments.map(
                      (comment) => (
                        <div
                          key={comment.id}
                          style={{
                            padding: 10,
                            borderRadius: 12,
                            background:
                              "#14161d",
                          }}
                        >
                          <strong
                            style={{
                              fontSize: 13,
                            }}
                          >
                            {comment
                              .profiles
                              ?.display_name ||
                              comment
                                .profile
                                ?.display_name ||
                              "مستخدم"}
                          </strong>

                          <div
                            style={{
                              marginTop: 4,
                              color:
                                "#bfc1c9",
                              fontSize: 13,
                            }}
                          >
                            {
                              comment.content
                            }
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Comment input */}

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  <input
                    id={`comment-${post.id}`}
                    value={
                      commentText[
                        post.id
                      ] || ""
                    }
                    onChange={(e) =>
                      setCommentText(
                        (current) => ({
                          ...current,
                          [post.id]:
                            e.target.value,
                        })
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key ===
                        "Enter"
                      ) {
                        addComment(post);
                      }
                    }}
                    placeholder="اكتب تعليقًا..."
                    style={{
                      flex: 1,
                      height: 42,
                      borderRadius: 12,
                      border:
                        "1px solid rgba(255,255,255,.08)",
                      background:
                        "#14161d",
                      color: "white",
                      padding:
                        "0 13px",
                      outline: "none",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      addComment(post)
                    }
                    style={{
                      width: 45,
                      border: 0,
                      borderRadius: 12,
                      background:
                        "linear-gradient(135deg,#7c3aed,#2563eb)",
                      color: "white",
                    }}
                  >
                    <Send size={17} />
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {/* ===================================
            الجانب الأيمن
        =================================== */}

        <aside className="right-sidebar">
          <div className="card side-card">
            <div className="side-title">
              أشخاص قد تعرفهم
            </div>

            {demoSuggestions.map(
              (suggestion) => (
                <div
                  className="suggestion"
                  key={suggestion.id}
                >
                  <img
                    src={suggestion.image}
                    alt=""
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />

                  <div className="suggestion-info">
                    <div className="suggestion-name">
                      {suggestion.name}
                    </div>

                    <div className="suggestion-user">
                      @{suggestion.username}
                    </div>
                  </div>

                  <button
                    className="follow-button"
                    onClick={() =>
                      alert(
                        `تم إرسال طلب متابعة إلى ${suggestion.name}`
                      )
                    }
                  >
                    <UserPlus
                      size={13}
                      style={{
                        verticalAlign:
                          "middle",
                        marginLeft: 3,
                      }}
                    />
                    متابعة
                  </button>
                </div>
              )
            )}
          </div>

          <div className="card side-card">
            <div className="side-title">
              حالتك
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#bfc1c9",
                fontSize: 13,
              }}
            >
              <span className="online-dot" />
              أنت متصل الآن
            </div>
          </div>

          <div className="card side-card">
            <div className="side-title">
              حسابك
            </div>

            <div
              style={{
                color: "#858894",
                fontSize: 12,
                lineHeight: 1.8,
              }}
            >
              <div>
                الاسم:{" "}
                <strong
                  style={{
                    color: "white",
                  }}
                >
                  {currentName}
                </strong>
              </div>

              <div>
                المستخدم:{" "}
                <strong
                  style={{
                    color: "white",
                  }}
                >
                  @{currentUsername}
                </strong>
              </div>

              <div>
                البريد:{" "}
                <strong
                  style={{
                    color: "white",
                    wordBreak:
                      "break-all",
                  }}
                >
                  {user.email}
                </strong>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              style={{
                width: "100%",
                height: 42,
                marginTop: 15,
                border: 0,
                borderRadius: 12,
                background:
                  "rgba(239,68,68,.12)",
                color: "#f87171",
                fontWeight: 800,
              }}
            >
              <LogOut
                size={16}
                style={{
                  verticalAlign:
                    "middle",
                  marginLeft: 6,
                }}
              />
              تسجيل الخروج
            </button>
          </div>
        </aside>
      </main>

      {/* =====================================
          قائمة الموبايل
      ===================================== */}

      <nav className="mobile-nav">
        <button className="active">
          <Home size={19} />
          <div>الرئيسية</div>
        </button>

        <button>
          <Search size={19} />
          <div>بحث</div>
        </button>

        <button>
          <PlusIcon />
          <div>نشر</div>
        </button>

        <button>
          <Bell size={19} />
          <div>التنبيهات</div>
        </button>

        <button onClick={logout}>
          <LogOut size={19} />
          <div>خروج</div>
        </button>
      </nav>

      {/* =====================================
          Mobile menu
      ===================================== */}

      {mobileMenu && (
        <div
          style={{
            position: "fixed",
            top: 70,
            left: 14,
            zIndex: 500,
            width: 230,
            padding: 10,
            borderRadius: 17,
            background: "#14161d",
            border:
              "1px solid rgba(255,255,255,.08)",
            boxShadow:
              "0 20px 60px rgba(0,0,0,.5)",
          }}
        >
          <button
            type="button"
            onClick={() =>
              setMobileMenu(false)
            }
            className="menu-item"
            style={{
              width: "100%",
              border: 0,
              background:
                "transparent",
            }}
          >
            <User size={19} />
            الملف الشخصي
          </button>

          <button
            type="button"
            onClick={() =>
              setMobileMenu(false)
            }
            className="menu-item"
            style={{
              width: "100%",
              border: 0,
              background:
                "transparent",
            }}
          >
            <Settings size={19} />
            الإعدادات
          </button>

          <button
            type="button"
            onClick={logout}
            className="menu-item"
            style={{
              width: "100%",
              border: 0,
              background:
                "transparent",
              color: "#f87171",
            }}
          >
            <LogOut size={19} />
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================
   التاريخ
========================================= */

function formatDate(date) {
  if (!date) return "الآن";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return "الآن";
  }

  const now = new Date();

  const diff =
    now.getTime() - d.getTime();

  const minutes = Math.floor(
    diff / 60000
  );

  if (minutes < 1) {
    return "الآن";
  }

  if (minutes < 60) {
    return `منذ ${minutes} دقيقة`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `منذ ${hours} ساعة`;
  }

  const days = Math.floor(
    hours / 24
  );

  if (days < 7) {
    return `منذ ${days} يوم`;
  }

  return d.toLocaleDateString(
    "ar-EG",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}

/* =========================================
   أيقونة +
========================================= */

function PlusIcon() {
  return (
    <span
      style={{
        display: "inline-grid",
        placeItems: "center",
        width: 21,
        height: 21,
        borderRadius: "50%",
        background:
          "linear-gradient(135deg,#7c3aed,#2563eb)",
        color: "white",
        fontWeight: 900,
        fontSize: 17,
      }}
    >
      +
    </span>
  );
}
