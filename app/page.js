"use client";

import { useEffect, useState } from "react";
import {
  Home,
  Search,
  Bell,
  MessageCircle,
  Video,
  Users,
  Heart,
  MessageSquare,
  Share2,
  Image as ImageIcon,
  Smile,
  MoreHorizontal,
  UserPlus,
  Play,
  Compass,
  Menu,
  LogOut,
  User,
  Lock,
  Mail,
  X,
} from "lucide-react";

import { createClient } from "../lib/supabase-browser";

const supabase = createClient();

const stories = [
  { name: "أنت", emoji: "➕" },
  { name: "Kanao", emoji: "🌸" },
  { name: "Mizo", emoji: "🔥" },
  { name: "Sasuke", emoji: "⚡" },
  { name: "Marin", emoji: "💜" },
  { name: "Tanjiro", emoji: "⚔️" },
];

const suggestedUsers = [
  { name: "Kanao Tsuyuri", username: "@kanao", emoji: "🌸" },
  { name: "Marin Kitagawa", username: "@marin", emoji: "💜" },
  { name: "Mizo", username: "@mizo", emoji: "🔥" },
];

const initialPosts = [
  {
    id: "demo-1",
    name: "Mizo",
    username: "@mizo",
    avatar: "M",
    time: "منذ 10 دقائق",
    text:
      "مرحبًا بكم في Mizo Social ❤️\nهنا سنشارك المنشورات والصور والفيديوهات ونتواصل مع بعضنا.",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80",
    likes: 128,
    comments: 24,
  },
  {
    id: "demo-2",
    name: "Kanao Tsuyuri",
    username: "@kanao",
    avatar: "🌸",
    time: "منذ ساعة",
    text: "يوم جميل جدًا ✨",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    likes: 89,
    comments: 12,
  },
  {
    id: "demo-3",
    name: "Mizo Videos",
    username: "@mizovideos",
    avatar: "▶️",
    time: "منذ ساعتين",
    text: "شاهدوا الفيديو الجديد 🎬🔥",
    video:
      "https://cdn.coverr.co/videos/coverr-a-woman-walking-in-the-city-1573/1080p.mp4",
    likes: 241,
    comments: 36,
  },
];

function formatTime(date) {
  if (!date) return "الآن";

  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  if (diff < 60) return "الآن";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `منذ ${minutes} دقيقة`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;

  const days = Math.floor(hours / 24);
  return `منذ ${days} يوم`;
}

export default function HomePage() {
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
  const [authError, setAuthError] = useState("");

  const [posts, setPosts] = useState(initialPosts);
  const [likedPosts, setLikedPosts] = useState([]);

  const [search, setSearch] = useState("");
  const [postText, setPostText] = useState("");

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [commentsOpen, setCommentsOpen] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState({});

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user);
        await loadPosts();
      }

      setLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user);
        await loadPosts();
      } else {
        setUser(null);
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function loadProfile(currentUser) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (error) {
      console.error("Profile error:", error);
      return;
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

      return;
    }

    const metadata = currentUser.user_metadata || {};

    const newProfile = {
      id: currentUser.id,
      username:
        metadata.username ||
        currentUser.email?.split("@")[0] ||
        `user_${currentUser.id.slice(0, 8)}`,
      display_name:
        metadata.display_name ||
        metadata.username ||
        currentUser.email?.split("@")[0] ||
        "مستخدم جديد",
      email: currentUser.email || null,
      is_online: true,
      last_seen: new Date().toISOString(),
    };

    const { data: created, error: createError } = await supabase
      .from("profiles")
      .insert(newProfile)
      .select()
      .single();

    if (createError) {
      console.error("Create profile error:", createError);
      return;
    }

    setProfile(created);
  }

  async function loadPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        content,
        image_url,
        video_url,
        created_at,
        user_id,
        profiles (
          username,
          display_name,
          avatar_url
        )
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Posts error:", error);
      return;
    }

    if (!data) return;

    const realPosts = data.map((post) => ({
      id: post.id,
      name: post.profiles?.display_name || "مستخدم",
      username: `@${post.profiles?.username || "user"}`,
      avatar:
        post.profiles?.avatar_url ||
        (post.profiles?.display_name || "م").charAt(0),
      time: formatTime(post.created_at),
      text: post.content || "",
      image: post.image_url || null,
      video: post.video_url || null,
      likes: 0,
      comments: 0,
      real: true,
    }));

    setPosts([...realPosts, ...initialPosts]);
  }

  async function handleAuth(event) {
    event.preventDefault();

    setAuthError("");
    setAuthMessage("");

    if (!email.trim() || !password.trim()) {
      setAuthError("اكتب البريد الإلكتروني وكلمة المرور.");
      return;
    }

    if (password.length < 6) {
      setAuthError("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      return;
    }

    if (authMode === "register" && !username.trim()) {
      setAuthError("اكتب اسم المستخدم.");
      return;
    }

    setAuthLoading(true);

    try {
      if (authMode === "register") {
        const cleanUsername = username.trim().toLowerCase();

        const { data: existingUsername, error: usernameError } =
          await supabase
            .from("profiles")
            .select("id")
            .eq("username", cleanUsername)
            .maybeSingle();

        if (usernameError) {
          console.error(usernameError);
        }

        if (existingUsername) {
          setAuthError("اسم المستخدم مستخدم بالفعل.");
          setAuthLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              username: cleanUsername,
              display_name:
                displayName.trim() || username.trim(),
            },
          },
        });

        if (error) {
          setAuthError(error.message);
          setAuthLoading(false);
          return;
        }

        if (data.user && data.session) {
          const { data: createdProfile, error: profileError } =
            await supabase
              .from("profiles")
              .insert({
                id: data.user.id,
                username: cleanUsername,
                display_name:
                  displayName.trim() || username.trim(),
                email: data.user.email,
                is_online: true,
                last_seen: new Date().toISOString(),
              })
              .select()
              .single();

          if (profileError) {
            console.error(profileError);

            if (!profileError.message.includes("duplicate")) {
              setAuthError(
                "تم إنشاء الحساب لكن حدث خطأ في إنشاء الملف الشخصي."
              );
            }
          } else {
            setProfile(createdProfile);
          }

          setUser(data.user);
          setAuthMessage("تم إنشاء الحساب بنجاح 🎉");
          await loadPosts();
        } else {
          setAuthMessage(
            "تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيد الحساب ثم سجل الدخول."
          );
        }
      } else {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (error) {
          setAuthError(
            "بيانات تسجيل الدخول غير صحيحة أو الحساب غير مؤكد."
          );
          setAuthLoading(false);
          return;
        }

        setUser(data.user);

        await loadProfile(data.user);
        await loadPosts();

        setAuthMessage("تم تسجيل الدخول بنجاح 👋");
      }
    } catch (error) {
      console.error(error);
      setAuthError("حدث خطأ غير متوقع. حاول مرة أخرى.");
    }

    setAuthLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();

    setUser(null);
    setProfile(null);
    setShowMenu(false);
    setAuthMessage("");
    setAuthError("");
  }

  async function toggleLike(id) {
    if (!user) return;

    const alreadyLiked = likedPosts.includes(id);

    if (alreadyLiked) {
      setLikedPosts(
        likedPosts.filter((postId) => postId !== id)
      );

      if (!String(id).startsWith("demo-")) {
        await supabase
          .from("likes")
          .delete()
          .eq("post_id", id)
          .eq("user_id", user.id);
      }
    } else {
      setLikedPosts([...likedPosts, id]);

      if (!String(id).startsWith("demo-")) {
        await supabase.from("likes").insert({
          post_id: id,
          user_id: user.id,
        });
      }
    }
  }

  async function createPost() {
    if (!user) return;

    if (!postText.trim()) return;

    const content = postText.trim();

    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        content,
      })
      .select(`
        id,
        content,
        image_url,
        video_url,
        created_at,
        profiles (
          username,
          display_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error(error);
      alert("حدث خطأ أثناء نشر المنشور.");
      return;
    }

    const newPost = {
      id: data.id,
      name: data.profiles?.display_name || profile?.display_name || "أنت",
      username: `@${
        data.profiles?.username ||
        profile?.username ||
        "user"
      }`,
      avatar:
        data.profiles?.avatar_url ||
        profile?.display_name?.charAt(0) ||
        "👤",
      time: "الآن",
      text: data.content,
      image: data.image_url,
      video: data.video_url,
      likes: 0,
      comments: 0,
      real: true,
    };

    setPosts([newPost, ...posts]);
    setPostText("");
  }

  async function addComment(postId) {
    if (!user || !commentText.trim()) return;

    if (String(postId).startsWith("demo-")) {
      setComments({
        ...comments,
        [postId]: [
          ...(comments[postId] || []),
          {
            id: Date.now(),
            content: commentText.trim(),
            name: profile?.display_name || "أنت",
          },
        ],
      });

      setCommentText("");
      return;
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_id: user.id,
        content: commentText.trim(),
      })
      .select(`
        id,
        content,
        created_at,
        profiles (
          display_name,
          username,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error(error);
      alert("حدث خطأ أثناء إضافة التعليق.");
      return;
    }

    setComments({
      ...comments,
      [postId]: [
        ...(comments[postId] || []),
        {
          id: data.id,
          content: data.content,
          name:
            data.profiles?.display_name ||
            profile?.display_name ||
            "أنت",
        },
      ],
    });

    setCommentText("");
  }

  const filteredPosts = posts.filter((post) => {
    const query = search.toLowerCase();

    return (
      post.text.toLowerCase().includes(query) ||
      post.name.toLowerCase().includes(query) ||
      post.username.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="loading-logo">M</div>
        <h2>Mizo Social</h2>
        <p>جاري تحميل المنصة...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-screen">
        <div className="auth-background"></div>

        <div className="auth-box">
          <div className="auth-logo">
            <div className="auth-logo-icon">M</div>
            <div>
              <h1>Mizo Social</h1>
              <p>منصتك الاجتماعية الجديدة</p>
            </div>
          </div>

          <div className="auth-tabs">
            <button
              className={authMode === "login" ? "active" : ""}
              onClick={() => {
                setAuthMode("login");
                setAuthError("");
                setAuthMessage("");
              }}
            >
              تسجيل الدخول
            </button>

            <button
              className={authMode === "register" ? "active" : ""}
              onClick={() => {
                setAuthMode("register");
                setAuthError("");
                setAuthMessage("");
              }}
            >
              إنشاء حساب
            </button>
          </div>

          <form onSubmit={handleAuth} className="auth-form">
            {authMode === "register" && (
              <>
                <div className="input-group">
                  <User size={18} />
                  <input
                    type="text"
                    placeholder="اسم المستخدم"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                  />
                </div>

                <div className="input-group">
                  <User size={18} />
                  <input
                    type="text"
                    placeholder="اسم العرض"
                    value={displayName}
                    onChange={(e) =>
                      setDisplayName(e.target.value)
                    }
                  />
                </div>
              </>
            )}

            <div className="input-group">
              <Mail size={18} />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <Lock size={18} />
              <input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete={
                  authMode === "login"
                    ? "current-password"
                    : "new-password"
                }
              />
            </div>

            {authError && (
              <div className="auth-error">
                {authError}
              </div>
            )}

            {authMessage && (
              <div className="auth-success">
                {authMessage}
              </div>
            )}

            <button
              className="auth-submit"
              type="submit"
              disabled={authLoading}
            >
              {authLoading
                ? "جاري التنفيذ..."
                : authMode === "login"
                ? "دخول إلى Mizo Social"
                : "إنشاء حساب جديد"}
            </button>
          </form>

          <div className="auth-footer">
            <span>✦</span>
            مجتمع Mizo Social
            <span>✦</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="social-app">
      {/* TOP BAR */}
      <header className="topbar">
        <div className="logo">
          <div className="logo-icon">M</div>
          <span className="logo-text">Mizo Social</span>
        </div>

        <div className="search-box">
          <Search className="search-icon" size={18} />

          <input
            type="text"
            placeholder="ابحث عن أشخاص أو منشورات..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="top-actions">
          <button
            className="icon-button relative"
            onClick={() => {
              setShowNotifications(
                !showNotifications
              );
              setShowMessages(false);
            }}
          >
            <Bell size={19} />
            <span className="notification-badge">
              3
            </span>
          </button>

          <button
            className="icon-button relative"
            onClick={() => {
              setShowMessages(!showMessages);
              setShowNotifications(false);
            }}
          >
            <MessageCircle size={19} />
            <span className="notification-badge">
              5
            </span>
          </button>

          <button
            className="icon-button hide-mobile"
            onClick={() => setShowMenu(!showMenu)}
          >
            <Menu size={20} />
          </button>

          <button
            className="avatar avatar-button"
            onClick={() => setShowMenu(!showMenu)}
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="avatar"
              />
            ) : (
              (
                profile?.display_name ||
                profile?.username ||
                "M"
              ).charAt(0)
            )}
          </button>
        </div>

        {showMenu && (
          <div className="profile-menu">
            <div className="profile-menu-user">
              <div className="avatar">
                {(
                  profile?.display_name ||
                  profile?.username ||
                  "M"
                ).charAt(0)}
              </div>

              <div>
                <strong>
                  {profile?.display_name ||
                    profile?.username ||
                    "مستخدم"}
                </strong>

                <small>
                  @{profile?.username || "user"}
                </small>
              </div>
            </div>

            <button className="profile-menu-item">
              <User size={18} />
              الملف الشخصي
            </button>

            <button
              className="profile-menu-item logout"
              onClick={logout}
            >
              <LogOut size={18} />
              تسجيل الخروج
            </button>
          </div>
        )}

        {showNotifications && (
          <div className="dropdown-card notifications-dropdown">
            <div className="dropdown-title">
              الإشعارات
            </div>

            <p>❤️ أعجب Kanao بمنشورك</p>
            <p>💬 أضاف Marin تعليقًا</p>
            <p>👤 بدأ شخص جديد بمتابعتك</p>
          </div>
        )}

        {showMessages && (
          <div className="dropdown-card messages-dropdown">
            <div className="dropdown-title">
              الرسائل
            </div>

            <p>🌸 Kanao: مرحبًا!</p>
            <p>💜 Marin: شاهدت منشورك</p>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="main-layout">
        {/* LEFT SIDEBAR */}
        <aside className="sidebar">
          <nav className="sidebar-menu">
            <a className="menu-item active" href="#">
              <Home size={20} />
              الرئيسية
            </a>

            <a className="menu-item" href="#">
              <Compass size={20} />
              استكشاف
            </a>

            <a className="menu-item" href="#">
              <Video size={20} />
              الفيديوهات
            </a>

            <a className="menu-item" href="#">
              <MessageCircle size={20} />
              الرسائل
            </a>

            <a className="menu-item" href="#">
              <Users size={20} />
              الأصدقاء
            </a>

            <a className="menu-item" href="#">
              <Bell size={20} />
              الإشعارات
            </a>

            <a className="menu-item" href="#">
              <UserPlus size={20} />
              الأشخاص
            </a>
          </nav>

          <div
            className="card side-card"
            style={{ marginTop: "20px" }}
          >
            <div className="side-title">
              Mizo Social
            </div>

            <p
              style={{
                color: "#777b87",
                lineHeight: "1.7",
                fontSize: "13px",
              }}
            >
              منصتك الجديدة للتواصل ومشاركة الصور
              والفيديوهات.
            </p>
          </div>
        </aside>

        {/* FEED */}
        <section className="feed">
          {/* STORIES */}
          <div className="stories">
            {stories.map((story, index) => (
              <div className="story" key={index}>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "42px",
                    background:
                      "linear-gradient(145deg,#161827,#30245c)",
                  }}
                >
                  {story.emoji}
                </div>

                <div className="story-name">
                  {story.name}
                </div>
              </div>
            ))}
          </div>

          {/* CREATE POST */}
          <div className="card create-post">
            <div className="create-row">
              <div className="avatar">
                {(
                  profile?.display_name ||
                  profile?.username ||
                  "M"
                ).charAt(0)}
              </div>

              <textarea
                value={postText}
                onChange={(e) =>
                  setPostText(e.target.value)
                }
                placeholder="ماذا تريد أن تنشر اليوم؟"
                style={{
                  flex: 1,
                  minHeight: "44px",
                  resize: "none",
                  border: "none",
                  outline: "none",
                  borderRadius: "14px",
                  padding: "12px 15px",
                  background: "#14161d",
                  color: "white",
                }}
              />
            </div>

            <div className="post-tools">
              <button className="post-tool">
                <ImageIcon size={17} />
                صورة
              </button>

              <button className="post-tool">
                <Video size={17} />
                فيديو
              </button>

              <button className="post-tool">
                <Smile size={17} />
                شعور
              </button>
            </div>

            <button
              onClick={createPost}
              style={{
                width: "100%",
                marginTop: "10px",
                height: "42px",
                border: "none",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg,#7c3aed,#2563eb)",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              نشر
            </button>
          </div>

          {/* POSTS */}
          {filteredPosts.map((post) => {
            const liked = likedPosts.includes(post.id);

            return (
              <article
                className="card post"
                key={post.id}
              >
                <div className="post-header">
                  <div className="user-info">
                    <div className="avatar">
                      {post.avatar}
                    </div>

                    <div>
                      <div className="user-name">
                        {post.name}
                      </div>

                      <div className="post-time">
                        {post.username} · {post.time}
                      </div>
                    </div>
                  </div>

                  <button className="post-menu">
                    <MoreHorizontal size={21} />
                  </button>
                </div>

                <div className="post-content">
                  {post.text}
                </div>

                {post.image && (
                  <div className="post-media">
                    <img
                      src={post.image}
                      alt="post"
                    />
                  </div>
                )}

                {post.video && (
                  <div className="post-media">
                    <video
                      controls
                      preload="metadata"
                    >
                      <source
                        src={post.video}
                        type="video/mp4"
                      />
                      متصفحك لا يدعم تشغيل الفيديو.
                    </video>
                  </div>
                )}

                <div className="post-stats">
                  <span>
                    ❤️{" "}
                    {post.likes +
                      (liked ? 1 : 0)}
                  </span>

                  <span>
                    {(comments[post.id] || []).length ||
                      post.comments} تعليق
                  </span>
                </div>

                <div className="post-actions">
                  <button
                    className={`post-action ${
                      liked ? "liked" : ""
                    }`}
                    onClick={() =>
                      toggleLike(post.id)
                    }
                  >
                    <Heart
                      size={18}
                      fill={
                        liked
                          ? "currentColor"
                          : "none"
                      }
                    />
                    إعجاب
                  </button>

                  <button
                    className="post-action"
                    onClick={() =>
                      setCommentsOpen(
                        commentsOpen === post.id
                          ? null
                          : post.id
                      )
                    }
                  >
                    <MessageSquare size={18} />
                    تعليق
                  </button>

                  <button className="post-action">
                    <Share2 size={18} />
                    مشاركة
                  </button>
                </div>

                {commentsOpen === post.id && (
                  <div className="comments-area">
                    {(comments[post.id] || []).map(
                      (comment) => (
                        <div
                          className="comment"
                          key={comment.id}
                        >
                          <div className="avatar">
                            {comment.name.charAt(0)}
                          </div>

                          <div className="comment-body">
                            <strong>
                              {comment.name}
                            </strong>
                            <p>
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      )
                    )}

                    <div className="comment-input">
                      <input
                        type="text"
                        placeholder="اكتب تعليقًا..."
                        value={commentText}
                        onChange={(e) =>
                          setCommentText(
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter"
                          ) {
                            addComment(post.id);
                          }
                        }}
                      />

                      <button
                        onClick={() =>
                          addComment(post.id)
                        }
                      >
                        إرسال
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}

          {filteredPosts.length === 0 && (
            <div
              className="card"
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#888",
              }}
            >
              لا توجد نتائج للبحث.
            </div>
          )}
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="right-sidebar">
          <div className="card side-card">
            <div className="side-title">
              اقتراحات لك
            </div>

            {suggestedUsers.map(
              (suggestion, index) => (
                <div
                  className="suggestion"
                  key={index}
                >
                  <div className="avatar">
                    {suggestion.emoji}
                  </div>

                  <div className="suggestion-info">
                    <div className="suggestion-name">
                      {suggestion.name}
                    </div>

                    <div className="suggestion-user">
                      {suggestion.username}
                    </div>
                  </div>

                  <button className="follow-button">
                    متابعة
                  </button>
                </div>
              )
            )}
          </div>

          <div className="card side-card">
            <div className="side-title">
              متصل الآن
            </div>

            {[
              "Kanao",
              "Marin",
              "Sasuke",
              "Tanjiro",
            ].map((name, index) => (
              <div
                className="suggestion"
                key={index}
              >
                <div className="avatar">
                  {["🌸", "💜", "⚡", "⚔️"][
                    index
                  ]}
                </div>

                <div className="suggestion-info">
                  <div className="suggestion-name">
                    {name}
                  </div>
                </div>

                <span className="online-dot"></span>
              </div>
            ))}
          </div>

          <div className="card side-card">
            <div className="side-title">
              <Play
                size={17}
                style={{
                  verticalAlign: "middle",
                }}
              />{" "}
              فيديوهات
            </div>

            <div
              style={{
                height: "130px",
                borderRadius: "14px",
                background:
                  "linear-gradient(135deg,#1e1b4b,#312e81,#111827)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Play size={35} />
            </div>

            <p
              style={{
                marginTop: "10px",
                color: "#aaa",
                fontSize: "13px",
              }}
            >
              اكتشف أحدث الفيديوهات على Mizo
              Social
            </p>
          </div>
        </aside>
      </main>

      {/* MOBILE NAV */}
      <nav className="mobile-nav">
        <button className="active">
          <Home size={20} />
          <br />
          الرئيسية
        </button>

        <button>
          <Compass size={20} />
          <br />
          استكشاف
        </button>

        <button>
          <Video size={20} />
          <br />
          فيديو
        </button>

        <button>
          <MessageCircle size={20} />
          <br />
          رسائل
        </button>

        <button>
          <Users size={20} />
          <br />
          أصدقاء
        </button>
      </nav>
    </div>
  );
}
