"use client";

import { useState } from "react";
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
} from "lucide-react";

const stories = [
  { name: "أنت", emoji: "➕" },
  { name: "Kanao", emoji: "🌸" },
  { name: "Mizo", emoji: "🔥" },
  { name: "Sasuke", emoji: "⚡" },
  { name: "Marin", emoji: "💜" },
  { name: "Tanjiro", emoji: "⚔️" },
];

const suggestedUsers = [
  { name: "Kanao Tsuyuri", username: "@kanao" },
  { name: "Marin Kitagawa", username: "@marin" },
  { name: "Mizo", username: "@mizo" },
];

const initialPosts = [
  {
    id: 1,
    name: "Mizo",
    username: "@mizo",
    avatar: "M",
    time: "منذ 10 دقائق",
    text: "مرحبًا بكم في Mizo Social ❤️\nهنا سنشارك المنشورات والصور والفيديوهات ونتواصل مع بعضنا.",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80",
    likes: 128,
    comments: 24,
  },
  {
    id: 2,
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
    id: 3,
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

export default function HomePage() {
  const [posts, setPosts] = useState(initialPosts);
  const [likedPosts, setLikedPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [postText, setPostText] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  function toggleLike(id) {
    if (likedPosts.includes(id)) {
      setLikedPosts(likedPosts.filter((postId) => postId !== id));
    } else {
      setLikedPosts([...likedPosts, id]);
    }
  }

  function createPost() {
    if (!postText.trim()) return;

    const newPost = {
      id: Date.now(),
      name: "أنت",
      username: "@you",
      avatar: "👤",
      time: "الآن",
      text: postText,
      likes: 0,
      comments: 0,
    };

    setPosts([newPost, ...posts]);
    setPostText("");
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.text.toLowerCase().includes(search.toLowerCase()) ||
      post.name.toLowerCase().includes(search.toLowerCase())
  );

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
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="top-actions">
          <button
            className="icon-button relative"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowMessages(false);
            }}
          >
            <Bell size={19} />
            <span className="notification-badge">3</span>
          </button>

          <button
            className="icon-button relative"
            onClick={() => {
              setShowMessages(!showMessages);
              setShowNotifications(false);
            }}
          >
            <MessageCircle size={19} />
            <span className="notification-badge">5</span>
          </button>

          <button
            className="icon-button hide-mobile"
            onClick={() => setShowMenu(!showMenu)}
          >
            <Menu size={20} />
          </button>

          <div className="avatar">M</div>
        </div>

        {showNotifications && (
          <div
            className="card"
            style={{
              position: "absolute",
              top: "62px",
              left: "120px",
              width: "280px",
              padding: "16px",
              zIndex: 300,
            }}
          >
            <strong>الإشعارات</strong>
            <p style={{ marginTop: "12px", color: "#aaa" }}>
              ❤️ أعجب Kanao بمنشورك
            </p>
            <p style={{ marginTop: "10px", color: "#aaa" }}>
              💬 أضاف Marin تعليقًا
            </p>
            <p style={{ marginTop: "10px", color: "#aaa" }}>
              👤 بدأ شخص جديد بمتابعتك
            </p>
          </div>
        )}

        {showMessages && (
          <div
            className="card"
            style={{
              position: "absolute",
              top: "62px",
              left: "70px",
              width: "280px",
              padding: "16px",
              zIndex: 300,
            }}
          >
            <strong>الرسائل</strong>
            <p style={{ marginTop: "12px", color: "#aaa" }}>
              🌸 Kanao: مرحبًا!
            </p>
            <p style={{ marginTop: "10px", color: "#aaa" }}>
              💜 Marin: شاهدت منشورك
            </p>
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

          <div className="card side-card" style={{ marginTop: "20px" }}>
            <div className="side-title">Mizo Social</div>

            <p style={{ color: "#777b87", lineHeight: "1.7", fontSize: "13px" }}>
              منصتك الجديدة للتواصل ومشاركة الصور والفيديوهات.
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

                <div className="story-name">{story.name}</div>
              </div>
            ))}
          </div>

          {/* CREATE POST */}
          <div className="card create-post">
            <div className="create-row">
              <div className="avatar">M</div>

              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
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
                <ImageIcon size={17} /> صورة
              </button>

              <button className="post-tool">
                <Video size={17} /> فيديو
              </button>

              <button className="post-tool">
                <Smile size={17} /> شعور
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
                background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                color: "white",
                fontWeight: "bold",
              }}
            >
              نشر
            </button>
          </div>

          {/* POSTS */}
          {filteredPosts.map((post) => {
            const liked = likedPosts.includes(post.id);

            return (
              <article className="card post" key={post.id}>
                <div className="post-header">
                  <div className="user-info">
                    <div className="avatar">{post.avatar}</div>

                    <div>
                      <div className="user-name">{post.name}</div>
                      <div className="post-time">
                        {post.username} · {post.time}
                      </div>
                    </div>
                  </div>

                  <button className="post-menu">
                    <MoreHorizontal size={21} />
                  </button>
                </div>

                <div className="post-content">{post.text}</div>

                {post.image && (
                  <div className="post-media">
                    <img src={post.image} alt="post" />
                  </div>
                )}

                {post.video && (
                  <div className="post-media">
                    <video controls preload="metadata">
                      <source src={post.video} type="video/mp4" />
                      متصفحك لا يدعم تشغيل الفيديو.
                    </video>
                  </div>
                )}

                <div className="post-stats">
                  <span>
                    ❤️ {post.likes + (liked ? 1 : 0)}
                  </span>

                  <span>{post.comments} تعليق</span>
                </div>

                <div className="post-actions">
                  <button
                    className={`post-action ${liked ? "liked" : ""}`}
                    onClick={() => toggleLike(post.id)}
                  >
                    <Heart
                      size={18}
                      fill={liked ? "currentColor" : "none"}
                    />
                    إعجاب
                  </button>

                  <button className="post-action">
                    <MessageSquare size={18} />
                    تعليق
                  </button>

                  <button className="post-action">
                    <Share2 size={18} />
                    مشاركة
                  </button>
                </div>
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
            <div className="side-title">اقتراحات لك</div>

            {suggestedUsers.map((user, index) => (
              <div className="suggestion" key={index}>
                <div className="avatar">
                  {["🌸", "💜", "🔥"][index]}
                </div>

                <div className="suggestion-info">
                  <div className="suggestion-name">{user.name}</div>
                  <div className="suggestion-user">{user.username}</div>
                </div>

                <button className="follow-button">متابعة</button>
              </div>
            ))}
          </div>

          <div className="card side-card">
            <div className="side-title">متصل الآن</div>

            {["Kanao", "Marin", "Sasuke", "Tanjiro"].map((name, index) => (
              <div className="suggestion" key={index}>
                <div className="avatar">
                  {["🌸", "💜", "⚡", "⚔️"][index]}
                </div>

                <div className="suggestion-info">
                  <div className="suggestion-name">{name}</div>
                </div>

                <span className="online-dot"></span>
              </div>
            ))}
          </div>

          <div className="card side-card">
            <div className="side-title">
              <Play size={17} style={{ verticalAlign: "middle" }} /> فيديوهات
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
              اكتشف أحدث الفيديوهات على Mizo Social
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
