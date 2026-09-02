"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase-browser";

const supabase = createClient();

/* =========================================
   SVG ICONS
========================================= */

function Icon({ name, size = 20, strokeWidth = 2 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      display: "inline-block",
      verticalAlign: "middle",
      flexShrink: 0,
    },
  };

  const paths = {
    home: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </>
    ),

    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),

    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),

    message: (
      <>
        <path d="M21 11.5a8 8 0 0 1-8.5 8A9.5 9.5 0 0 1 8 18.5L3 20l1.5-4A8 8 0 0 1 3 11.5 8 8 0 0 1 11 4h2a8 8 0 0 1 8 7.5Z" />
      </>
    ),

    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),

    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),

    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V21h-2v-.48a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06L9 17.94l.06-.06A1.7 1.7 0 0 0 9.4 16a1.7 1.7 0 0 0-1.56-1.04H7v-2h.84A1.7 1.7 0 0 0 9.4 12a1.7 1.7 0 0 0-.34-1.88L9 10.06l1.42-1.42.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 13.4 7.48V7h2v.48a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06A1.7 1.7 0 0 0 19.4 12a1.7 1.7 0 0 0 1.56 1.04H21v2h-.04A1.7 1.7 0 0 0 19.4 15Z" />
      </>
    ),

    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 3v18" />
        <path d="M17 3h4v18h-4" />
      </>
    ),

    heart: (
      <path d="M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
    ),

    comment: (
      <>
        <path d="M21 11.5a8 8 0 0 1-8.5 8A9.5 9.5 0 0 1 8 18.5L3 20l1.5-4A8 8 0 0 1 3 11.5 8 8 0 0 1 11 4h2a8 8 0 0 1 8 7.5Z" />
      </>
    ),

    share: (
      <>
        <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
        <path d="m12 16 5-5" />
        <path d="m12 16-5-5" />
        <path d="M12 16V3" />
      </>
    ),

    more: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="19" cy="12" r="1" fill="currentColor" />
      </>
    ),

    image: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9" r="1.5" />
        <path d="m21 15-5-5L5 20" />
      </>
    ),

    video: (
      <>
        <rect x="3" y="5" width="13" height="14" rx="2" />
        <path d="m16 10 5-3v10l-5-3" />
      </>
    ),

    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </>
    ),

    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),

    sparkles: (
      <>
        <path d="m12 3-1.5 5.5L5 10l5.5 1.5L12 17l1.5-5.5L19 10l-5.5-1.5Z" />
        <path d="m19 16-.7 2.3L16 19l2.3.7L19 22l.7-2.3L22 19l-2.3-.7Z" />
      </>
    ),

    at: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M16 12v1a3 3 0 0 0 6 0v-1a10 10 0 1 0-3 7.5" />
      </>
    ),

    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),

    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),

    shield: (
      <>
        <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),

    check: (
      <>
        <path d="m5 12 4 4L19 6" />
      </>
    ),

    menu: (
      <>
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </>
    ),

    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),

    userPlus: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M2 21a7 7 0 0 1 14 0" />
        <path d="M19 8v6" />
        <path d="M16 11h6" />
      </>
    ),
  };

  return (
    <svg {...common} aria-hidden="true">
      {paths[name] || paths.user}
    </svg>
  );
}

/* =========================================
   بيانات تجريبية
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
   الصفحة
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
     AUTH INITIALIZATION
  ========================================= */

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(
            window.location.search
          );

          if (params.get("logout") === "1") {
            await supabase.auth.signOut({
              scope: "local",
            });

            if (mounted) {
              setUser(null);
              setProfile(null);
              setLoading(false);
            }

            window.history.replaceState({}, "", "/");
            return;
          }
        }

        const {
          data,
          error,
        } = await supabase.auth.getUser();

        if (!mounted) return;

        if (error || !data?.user) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setUser(data.user);

        await loadProfile(data.user);
        await loadPosts();

        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error(
          "Auth initialization error:",
          error
        );

        if (mounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
          await loadPosts();

          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* =========================================
     LOAD PROFILE
  ========================================= */

  async function loadProfile(currentUser) {
    if (!currentUser?.id) return null;

    try {
      const {
        data,
        error,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (error) {
        console.error(
          "Profile load error:",
          error
        );
        return null;
      }

      if (data) {
        setProfile(data);

        try {
          await supabase
            .from("profiles")
            .update({
              is_online: true,
              last_seen:
                new Date().toISOString(),
            })
            .eq("id", currentUser.id);
        } catch (error) {
          console.error(
            "Online update error:",
            error
          );
        }

        return data;
      }

      const meta =
        currentUser.user_metadata || {};

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
        last_seen:
          new Date().toISOString(),
      };

      const {
        data: created,
        error: createError,
      } = await supabase
        .from("profiles")
        .insert(newProfile)
        .select()
        .single();

      if (createError) {
        console.error(
          "Profile create error:",
          createError
        );
        return null;
      }

      setProfile(created);

      return created;
    } catch (error) {
      console.error(
        "Profile error:",
        error
      );

      return null;
    }
  }

  /* =========================================
     LOAD POSTS
  ========================================= */

  async function loadPosts() {
    try {
      const {
        data,
        error,
      } = await supabase
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
        console.error(
          "Posts error:",
          error
        );

        setPosts([]);
        return;
      }

      const realPosts =
        (data || []).map((post) => ({
          ...post,
          isDemo: false,
        }));

      setPosts(realPosts);
    } catch (error) {
      console.error(
        "Load posts error:",
        error
      );

      setPosts([]);
    }
  }

  /* =========================================
     AUTH
  ========================================= */

  async function handleAuth(event) {
    event.preventDefault();

    setAuthMessage("");
    setAuthSuccess(false);

    if (!email.trim()) {
      setAuthMessage(
        "اكتب البريد الإلكتروني."
      );
      return;
    }

    if (!password.trim()) {
      setAuthMessage(
        "اكتب كلمة المرور."
      );
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
      setAuthMessage(
        "اكتب اسم المستخدم."
      );
      return;
    }

    setAuthLoading(true);

    try {
      if (authMode === "register") {
        const {
          data: existingUsername,
          error: usernameError,
        } = await supabase
          .from("profiles")
          .select("id")
          .eq(
            "username",
            username.trim()
          )
          .maybeSingle();

        if (usernameError) {
          console.error(
            usernameError
          );
        }

        if (existingUsername) {
          setAuthMessage(
            "اسم المستخدم مستخدم بالفعل."
          );

          setAuthLoading(false);
          return;
        }

        const {
          data,
          error,
        } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              username:
                username.trim(),

              display_name:
                displayName.trim() ||
                username.trim(),
            },
          },
        });

        if (error) {
          setAuthMessage(
            error.message
          );

          setAuthLoading(false);
          return;
        }

        if (
          data?.user &&
          !data?.session
        ) {
          setAuthSuccess(true);

          setAuthMessage(
            "تم إنشاء الحساب. تحقق من بريدك الإلكتروني ثم سجل الدخول."
          );

          setAuthLoading(false);
          return;
        }

        if (data?.user) {
          setUser(data.user);

          await loadProfile(data.user);
          await loadPosts();

          setAuthSuccess(true);

          setAuthMessage(
            "تم إنشاء الحساب بنجاح."
          );

          setTimeout(() => {
            setAuthMessage("");
          }, 1500);
        }
      } else {
        const {
          data,
          error,
        } = await supabase.auth.signInWithPassword({
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
        await loadPosts();

        setAuthSuccess(true);

        setAuthMessage(
          "تم تسجيل الدخول بنجاح."
        );

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
     LOGOUT
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

    if (
      typeof window !== "undefined"
    ) {
      window.location.href = "/";
    }
  }

  /* =========================================
     CREATE POST
  ========================================= */

  async function createPost() {
    if (!user) return;

    const content =
      postText.trim();

    if (!content) return;

    const {
      data,
      error,
    } = await supabase
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
     LIKE
  ========================================= */

  async function toggleLike(post) {
    if (!user || post.isDemo) {
      setLikedPosts((current) => ({
        ...current,
        [post.id]:
          !current[post.id],
      }));

      return;
    }

    const isLiked =
      likedPosts[post.id];

    if (isLiked) {
      const {
        error,
      } = await supabase
        .from("likes")
        .delete()
        .eq(
          "post_id",
          post.id
        )
        .eq(
          "user_id",
          user.id
        );

      if (!error) {
        setLikedPosts(
          (current) => ({
            ...current,
            [post.id]: false,
          })
        );
      }
    } else {
      const {
        error,
      } = await supabase
        .from("likes")
        .insert({
          post_id: post.id,
          user_id: user.id,
        });

      if (!error) {
        setLikedPosts(
          (current) => ({
            ...current,
            [post.id]: true,
          })
        );
      }
    }
  }

  /* =========================================
     COMMENT
  ========================================= */

  async function addComment(post) {
    if (!user) return;

    const text = (
      commentText[post.id] ||
      ""
    ).trim();

    if (!text) return;

    if (post.isDemo) {
      setComments(
        (current) => ({
          ...current,
          [post.id]: [
            ...(current[post.id] ||
              []),
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
        })
      );

      setCommentText(
        (current) => ({
          ...current,
          [post.id]: "",
        })
      );

      return;
    }

    const {
      data,
      error,
    } = await supabase
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
      setComments(
        (current) => ({
          ...current,
          [post.id]: [
            ...(current[post.id] ||
              []),
            data,
          ],
        })
      );
    }

    setCommentText(
      (current) => ({
        ...current,
        [post.id]: "",
      })
    );
  }

  /* =========================================
     DELETE POST
  ========================================= */

  async function deletePost(post) {
    if (!user || post.isDemo) {
      return;
    }

    if (post.user_id !== user.id) {
      return;
    }

    const ok = window.confirm(
      "هل تريد حذف هذا المنشور؟"
    );

    if (!ok) return;

    const {
      error,
    } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id)
      .eq(
        "user_id",
        user.id
      );

    if (error) {
      alert(
        "تعذر حذف المنشور: " +
          error.message
      );

      return;
    }

    setPosts(
      (current) =>
        current.filter(
          (item) =>
            item.id !== post.id
        )
    );

    setOpenMenu(null);
  }

  /* =========================================
     FOLLOW
  ========================================= */

  async function followUser(targetId) {
    if (!user || !targetId) {
      return;
    }

    if (targetId === user.id) {
      return;
    }

    const {
      error,
    } = await supabase
      .from("follows")
      .insert({
        follower_id: user.id,
        following_id: targetId,
      });

    if (
      error &&
      !error.message
        ?.toLowerCase()
        .includes("duplicate")
    ) {
      console.error(error);
      return;
    }

    alert("تمت المتابعة.");
  }

  /* =========================================
     SEARCH
  ========================================= */

  const filteredPosts =
    posts.filter((post) => {
      if (!search.trim()) {
        return true;
      }

      const query =
        search.trim().toLowerCase();

      const content =
        post.content?.toLowerCase() ||
        "";

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
     USER INFO
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
     LOADING
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
     AUTH SCREEN
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
                      position:
                        "relative",
                    }}
                  >
                    <Icon
                      name="at"
                      size={18}
                      strokeWidth={2}
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
                  position:
                    "relative",
                }}
              >
                <Icon
                  name="mail"
                  size={18}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
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
                  position:
                    "relative",
                }}
              >
                <Icon
                  name="lock"
                  size={18}
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
            <Icon
              name="shield"
              size={14}
            />
            حسابك محمي بواسطة Supabase
          </div>
        </div>
      </main>
    );
  }

  /* =========================================
     MAIN APP
  ========================================= */

  return (
    <div className="social-app">

      {/* =====================================
          TOP BAR
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
          <Icon
            name="search"
            size={19}
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="ابحث عن منشور أو شخص..."
          />
        </div>

        <div className="top-actions">
          <button
            className="icon-button relative"
            title="الإشعارات"
            type="button"
          >
            <Icon
              name="bell"
              size={20}
            />

            <span className="notification-badge">
              3
            </span>
          </button>

          <button
            className="icon-button hide-mobile"
            title="الرسائل"
            type="button"
          >
            <Icon
              name="message"
              size={20}
            />
          </button>

          <button
            className="icon-button"
            type="button"
            onClick={() =>
              setMobileMenu(
                !mobileMenu
              )
            }
          >
            <Icon
              name={
                mobileMenu
                  ? "close"
                  : "menu"
              }
              size={20}
            />
          </button>
        </div>
      </header>

      {/* =====================================
          MAIN LAYOUT
      ===================================== */}

      <main className="main-layout">

        {/* ===================================
            LEFT SIDEBAR
        =================================== */}

        <aside className="sidebar">
          <nav className="sidebar-menu">

            <a
              href="#home"
              className="menu-item active"
            >
              <Icon
                name="home"
                size={20}
              />
              <span>الرئيسية</span>
            </a>

            <a
              href="#discover"
              className="menu-item"
            >
              <Icon
                name="sparkles"
                size={20}
              />
              <span>اكتشف</span>
            </a>

            <a
              href="#messages"
              className="menu-item"
            >
              <Icon
                name="message"
                size={20}
              />
              <span>الرسائل</span>
            </a>

            <a
              href="#friends"
              className="menu-item"
            >
              <Icon
                name="users"
                size={20}
              />
              <span>الأصدقاء</span>
            </a>

            <a
              href="#profile"
              className="menu-item"
            >
              <Icon
                name="user"
                size={20}
              />
              <span>الملف الشخصي</span>
            </a>

            <button
              type="button"
              className="menu-item"
              onClick={logout}
              style={{
                border: 0,
                background:
                  "transparent",
                width: "100%",
                textAlign: "right",
              }}
            >
              <Icon
                name="logout"
                size={20}
              />

              <span>
                تسجيل الخروج
              </span>
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
                    src={
                      profile.avatar_url
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
            FEED
        =================================== */}

        <section className="feed">

          {/* Stories */}

          <div className="stories">
            {demoStories.map(
              (story) => (
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
              )
            )}
          </div>

          {/* Create Post */}

          <div className="card create-post">
            <div className="create-row">

              <div className="avatar">
                {profile?.avatar_url ? (
                  <img
                    src={
                      profile.avatar_url
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
                  border:
                    "1px solid rgba(255,255,255,.08)",
                  borderRadius: 14,
                  background:
                    "#14161d",
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
                <Icon
                  name="image"
                  size={17}
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
                <Icon
                  name="video"
                  size={17}
                />
                فيديو
              </button>

              <button
                className="post-tool"
                type="button"
                onClick={createPost}
              >
                <Icon
                  name="send"
                  size={17}
                />
                نشر
              </button>
            </div>
          </div>

          {/* Empty */}

          {filteredPosts.length ===
            0 && (
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

          {/* Posts */}

          {filteredPosts.map(
            (post) => {
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
                !!likedPosts[
                  post.id
                ];

              const postComments =
                comments[
                  post.id
                ] || [];

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
                              width:
                                "100%",
                              height:
                                "100%",
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
                        position:
                          "relative",
                      }}
                    >
                      <button
                        className="post-menu"
                        type="button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu ===
                              post.id
                              ? null
                              : post.id
                          )
                        }
                      >
                        <Icon
                          name="more"
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
                            borderRadius:
                              13,
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
                                  borderRadius:
                                    9,
                                }}
                              >
                                حذف المنشور
                              </button>
                            )}

                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(
                                window
                                  .location
                                  .href
                              );

                              setOpenMenu(
                                null
                              );
                            }}
                            style={{
                              width:
                                "100%",
                              border: 0,
                              background:
                                "transparent",
                              color:
                                "#ddd",
                              padding: 10,
                              textAlign:
                                "right",
                              borderRadius:
                                9,
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
                        src={
                          post.image_url
                        }
                        alt=""
                      />
                    </div>
                  )}

                  {/* Video */}

                  {post.video_url && (
                    <div className="post-media">
                      <video
                        src={
                          post.video_url
                        }
                        controls
                      />
                    </div>
                  )}

                  {/* Stats */}

                  <div className="post-stats">
                    <span>
                      {liked
                        ? "❤️"
                        : "♡"}{" "}
                      إعجاب
                    </span>

                    <span>
                      {
                        postComments.length
                      }{" "}
                      تعليق
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
                        toggleLike(
                          post
                        )
                      }
                    >
                      <Icon
                        name="heart"
                        size={18}
                        strokeWidth={2}
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
                      <Icon
                        name="comment"
                        size={18}
                      />

                      تعليق
                    </button>

                    <button
                      className="post-action"
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(
                          window
                            .location
                            .href
                        );

                        alert(
                          "تم نسخ رابط الموقع."
                        );
                      }}
                    >
                      <Icon
                        name="share"
                        size={18}
                      />

                      مشاركة
                    </button>

                  </div>

                  {/* Comments */}

                  {postComments.length >
                    0 && (
                    <div
                      style={{
                        marginTop: 14,
                        display:
                          "flex",
                        flexDirection:
                          "column",
                        gap: 8,
                      }}
                    >
                      {postComments.map(
                        (comment) => (
                          <div
                            key={
                              comment.id
                            }
                            style={{
                              padding: 10,
                              borderRadius:
                                12,
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
                                marginTop:
                                  4,
                                color:
                                  "#bfc1c9",
                                fontSize:
                                  13,
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

                  {/* Comment Input */}

                  <div
                    style={{
                      display:
                        "flex",
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
                          addComment(
                            post
                          );
                        }
                      }}
                      placeholder="اكتب تعليقًا..."
                      style={{
                        flex: 1,
                        height: 42,
                        borderRadius:
                          12,
                        border:
                          "1px solid rgba(255,255,255,.08)",
                        background:
                          "#14161d",
                        color:
                          "white",
                        padding:
                          "0 13px",
                        outline:
                          "none",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        addComment(
                          post
                        )
                      }
                      style={{
                        width: 45,
                        border: 0,
                        borderRadius:
                          12,
                        background:
                          "linear-gradient(135deg,#7c3aed,#2563eb)",
                        color:
                          "white",
                      }}
                    >
                      <Icon
                        name="send"
                        size={17}
                      />
                    </button>
                  </div>
                </article>
              );
            }
          )}
        </section>

        {/* ===================================
            RIGHT SIDEBAR
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
                    src={
                      suggestion.image
                    }
                    alt=""
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius:
                        "50%",
                      objectFit:
                        "cover",
                    }}
                  />

                  <div className="suggestion-info">

                    <div className="suggestion-name">
                      {
                        suggestion.name
                      }
                    </div>

                    <div className="suggestion-user">
                      @
                      {
                        suggestion.username
                      }
                    </div>

                  </div>

                  <button
                    className="follow-button"
                    type="button"
                    onClick={() =>
                      alert(
                        `تم إرسال طلب متابعة إلى ${suggestion.name}`
                      )
                    }
                  >
                    <Icon
                      name="userPlus"
                      size={13}
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
                display:
                  "flex",
                alignItems:
                  "center",
                gap: 8,
                color:
                  "#bfc1c9",
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
                color:
                  "#858894",
                fontSize: 12,
                lineHeight:
                  1.8,
              }}
            >

              <div>
                الاسم:{" "}
                <strong
                  style={{
                    color:
                      "white",
                  }}
                >
                  {currentName}
                </strong>
              </div>

              <div>
                المستخدم:{" "}
                <strong
                  style={{
                    color:
                      "white",
                  }}
                >
                  @{currentUsername}
                </strong>
              </div>

              <div>
                البريد:{" "}
                <strong
                  style={{
                    color:
                      "white",
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
                width:
                  "100%",
                height: 42,
                marginTop: 15,
                border: 0,
                borderRadius:
                  12,
                background:
                  "rgba(239,68,68,.12)",
                color:
                  "#f87171",
                fontWeight:
                  800,
              }}
            >
              <Icon
                name="logout"
                size={16}
              />

              تسجيل الخروج
            </button>
          </div>
        </aside>
      </main>

      {/* =====================================
          MOBILE NAV
      ===================================== */}

      <nav className="mobile-nav">

        <button
          className="active"
          type="button"
        >
          <Icon
            name="home"
            size={19}
          />
          <div>الرئيسية</div>
        </button>

        <button
          type="button"
          onClick={() => {
            const input =
              document.querySelector(
                ".search-box input"
              );

            input?.focus();
          }}
        >
          <Icon
            name="search"
            size={19}
          />
          <div>بحث</div>
        </button>

        <button
          type="button"
          onClick={() => {
            const textarea =
              document.querySelector(
                ".create-post textarea"
              );

            textarea?.focus();
          }}
        >
          <PlusIcon />
          <div>نشر</div>
        </button>

        <button
          type="button"
          onClick={() =>
            alert(
              "لا توجد إشعارات جديدة."
            )
          }
        >
          <Icon
            name="bell"
            size={19}
          />
          <div>التنبيهات</div>
        </button>

        <button
          type="button"
          onClick={logout}
        >
          <Icon
            name="logout"
            size={19}
          />
          <div>خروج</div>
        </button>
      </nav>

      {/* =====================================
          MOBILE MENU
      ===================================== */}

      {mobileMenu && (
        <div
          style={{
            position:
              "fixed",
            top: 70,
            left: 14,
            zIndex: 500,
            width: 230,
            padding: 10,
            borderRadius:
              17,
            background:
              "#14161d",
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
              width:
                "100%",
              border: 0,
              background:
                "transparent",
            }}
          >
            <Icon
              name="user"
              size={19}
            />

            الملف الشخصي
          </button>

          <button
            type="button"
            onClick={() =>
              setMobileMenu(false)
            }
            className="menu-item"
            style={{
              width:
                "100%",
              border: 0,
              background:
                "transparent",
            }}
          >
            <Icon
              name="settings"
              size={19}
            />

            الإعدادات
          </button>

          <button
            type="button"
            onClick={logout}
            className="menu-item"
            style={{
              width:
                "100%",
              border: 0,
              background:
                "transparent",
              color:
                "#f87171",
            }}
          >
            <Icon
              name="logout"
              size={19}
            />

            تسجيل الخروج
          </button>

        </div>
      )}
    </div>
  );
}

/* =========================================
   DATE FORMAT
========================================= */

function formatDate(date) {
  if (!date) {
    return "الآن";
  }

  const d =
    new Date(date);

  if (
    Number.isNaN(
      d.getTime()
    )
  ) {
    return "الآن";
  }

  const now =
    new Date();

  const diff =
    now.getTime() -
    d.getTime();

  const minutes =
    Math.floor(
      diff / 60000
    );

  if (minutes < 1) {
    return "الآن";
  }

  if (minutes < 60) {
    return `منذ ${minutes} دقيقة`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  if (hours < 24) {
    return `منذ ${hours} ساعة`;
  }

  const days =
    Math.floor(
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
   PLUS ICON
========================================= */

function PlusIcon() {
  return (
    <span
      style={{
        display:
          "inline-grid",
        placeItems:
          "center",
        width: 21,
        height: 21,
        borderRadius:
          "50%",
        background:
          "linear-gradient(135deg,#7c3aed,#2563eb)",
        color:
          "white",
        fontWeight:
          900,
        fontSize: 17,
        lineHeight: 1,
      }}
    >
      +
    </span>
  );
}
