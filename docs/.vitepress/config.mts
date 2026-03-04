import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "AaronAust1n",
  description: "A Personal Blog, record my thoughts and ideas, and share my knowledge and experiences. Wait for the world to be rebuilt by AGI. And save a copy for myself.",
  
  // Transform frontmatter to meta tags for SEO
  transformHead: ({ pageData }) => {
    const head = []
    
    // Add keywords meta tag
    if (pageData.frontmatter.keywords) {
      head.push(['meta', { name: 'keywords', content: pageData.frontmatter.keywords }])
    }
    
    // Add Open Graph tags
    if (pageData.frontmatter.title) {
      head.push(['meta', { property: 'og:title', content: pageData.frontmatter.title }])
    }
    if (pageData.frontmatter.description) {
      head.push(['meta', { property: 'og:description', content: pageData.frontmatter.description }])
    }
    if (pageData.frontmatter.date) {
      head.push(['meta', { property: 'article:published_time', content: pageData.frontmatter.date }])
    }
    if (pageData.frontmatter.tags) {
      pageData.frontmatter.tags.forEach(tag => {
        head.push(['meta', { property: 'article:tag', content: tag }])
      })
    }
    
    // Add Twitter Card tags
    head.push(['meta', { name: 'twitter:card', content: 'summary_large_image' }])
    if (pageData.frontmatter.title) {
      head.push(['meta', { name: 'twitter:title', content: pageData.frontmatter.title }])
    }
    if (pageData.frontmatter.description) {
      head.push(['meta', { name: 'twitter:description', content: pageData.frontmatter.description }])
    }
    
    return head
  },
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'google-site-verification', content: '7qOTQI0S3WKsYoD1raJBVSPNzUVUo-J3hLqeGLcpL_0' }],

    // Home (en / zh)
    ['link', { rel: 'alternate', hreflang: 'en', href: 'https://aaronaust1n.github.io/' }],
    ['link', { rel: 'alternate', hreflang: 'zh-CN', href: 'https://aaronaust1n.github.io/zh/' }],

    // Blog index (en / zh)
    ['link', { rel: 'alternate', hreflang: 'en', href: 'https://aaronaust1n.github.io/posts/' }],
    ['link', { rel: 'alternate', hreflang: 'zh-CN', href: 'https://aaronaust1n.github.io/zh/posts/' }],

    // Key articles: Attention history (en / zh)
    ['link', { rel: 'alternate', hreflang: 'en', href: 'https://aaronaust1n.github.io/posts/attention-history.html' }],
    ['link', { rel: 'alternate', hreflang: 'zh-CN', href: 'https://aaronaust1n.github.io/zh/posts/attention-history.html' }],

    // Key articles: Inner / outer world (en / zh)
    ['link', { rel: 'alternate', hreflang: 'en', href: 'https://aaronaust1n.github.io/posts/inner-world-and-outer-world.html' }],
    ['link', { rel: 'alternate', hreflang: 'zh-CN', href: 'https://aaronaust1n.github.io/zh/posts/inner-world-and-outer-world.html' }],

    // Key articles: Information depression (en / zh)
    ['link', { rel: 'alternate', hreflang: 'en', href: 'https://aaronaust1n.github.io/posts/information-depression.html' }],
    ['link', { rel: 'alternate', hreflang: 'zh-CN', href: 'https://aaronaust1n.github.io/zh/posts/information-depression.html' }],

    // Key articles: Agent infrastructure (en / zh)
    ['link', { rel: 'alternate', hreflang: 'en', href: 'https://aaronaust1n.github.io/posts/agent-infrastructure.html' }],
    ['link', { rel: 'alternate', hreflang: 'zh-CN', href: 'https://aaronaust1n.github.io/zh/posts/agent-infrastructure.html' }],

    // Key articles: AI opportunity (en / zh)
    ['link', { rel: 'alternate', hreflang: 'en', href: 'https://aaronaust1n.github.io/posts/ai-opportunity-blog.html' }],
    ['link', { rel: 'alternate', hreflang: 'zh-CN', href: 'https://aaronaust1n.github.io/zh/posts/ai-opportunity-blog.html' }],

    // Key articles: Ontology decision (en / zh)
    ['link', { rel: 'alternate', hreflang: 'en', href: 'https://aaronaust1n.github.io/posts/blog_ontology_decision.html' }],
    ['link', { rel: 'alternate', hreflang: 'zh-CN', href: 'https://aaronaust1n.github.io/zh/posts/blog_ontology_decision.html' }],

    // Key articles: Palantir valuation (en / zh)
    ['link', { rel: 'alternate', hreflang: 'en', href: 'https://aaronaust1n.github.io/posts/palantir_valuation.html' }],
    ['link', { rel: 'alternate', hreflang: 'zh-CN', href: 'https://aaronaust1n.github.io/zh/posts/palantir_valuation.html' }],

    // Key articles: Open source trap (en / zh)
    ['link', { rel: 'alternate', hreflang: 'en', href: 'https://aaronaust1n.github.io/posts/opensource-trap.html' }],
    ['link', { rel: 'alternate', hreflang: 'zh-CN', href: 'https://aaronaust1n.github.io/zh/posts/opensource-trap.html' }]
  ],
  // sitemap: {
  //   hostname: 'https://aaronaust1n.github.io'
  // },
  
  // Internationalization Configuration
  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
    zh: {
      label: '简体中文',
      lang: 'zh', // optional, will be added as `lang` attribute on `html` tag
      link: '/zh/', // default /fr/ -- shows on navbar translations menu, can be external
      
      // localized theme config
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '博客', link: '/zh/posts/' },
          { text: '标签', link: '/zh/posts/tags' },
          { text: '投票', link: '/zh/vote' }
        ],

        sidebar: [
          {
            text: '最近更新',
            items: [
              { text: '开源大模型的诅咒', link: '/zh/posts/opensource-trap' },
              { text: '84%的人类还没碰过AI，这才是真正的故事', link: '/zh/posts/ai-opportunity-blog' },
              { text: 'AI决策的真正瓶颈不是算法，而是你无法形式化业务逻辑', link: '/zh/posts/blog_ontology_decision' },
              { text: 'Palantir的4000亿估值，藏在哪个盲区里？', link: '/zh/posts/palantir_valuation' },
              { text: 'Agent时代的基建，我们想错了', link: '/zh/posts/agent-infrastructure' },
              { text: '当软件正在变成手工艺，我们正在制造一场信息大萧条', link: '/zh/posts/information-depression' },
              { text: '里世界与表世界', link: '/zh/posts/inner-world-and-outer-world' },
              { text: '注意力简史', link: '/zh/posts/attention-history' }
            ]
          }
        ],

        footer: {
          message: '基于 MIT 许可发布。',
          copyright: '版权所有 © 2026 AaronAust1n'
        },
        
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },
        
        outline: {
          label: '本页目录',
          level: [2, 4]
        },
        
        lastUpdated: {
          text: '最后更新于',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'medium'
          }
        },
        
        langMenuLabel: '多语言',
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式'
      }
    }
  },

  themeConfig: {
    // Shared config
    socialLinks: [
      { icon: 'github', link: 'https://github.com/AaronAust1n/AaronAust1n.github.io' }
    ],

    // Enable deep outline for all pages
    outline: {
      level: [2, 4], // Show h2 to h4 in the outline
      label: 'On this page'
    },

    // Default (English) config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/posts/' },
      { text: 'Tags', link: '/posts/tags' },
      { text: 'Vote', link: '/vote' }
    ],

    sidebar: [
      {
        text: 'Recent Posts',
        items: [
          { text: 'The Curse of Open Source LLMs', link: '/posts/opensource-trap' },
          { text: '84% of Humanity Hasn\'t Touched AI Yet—That\'s the Real Story', link: '/posts/ai-opportunity-blog' },
          { text: 'The Real Bottleneck in AI Decision-Making Isn\'t Algorithms', link: '/posts/blog_ontology_decision' },
          { text: 'Palantir\'s $400B Valuation—What Blind Spot Is It Hiding In?', link: '/posts/palantir_valuation' },
          { text: 'We Got Agent Infrastructure Wrong', link: '/posts/agent-infrastructure' },
          { text: 'When Software Becomes Handicraft, We Are Building an Information Great Depression', link: '/posts/information-depression' },
          { text: 'The Inner World and the Outer World', link: '/posts/inner-world-and-outer-world' },
          { text: 'A Brief History of Attention', link: '/posts/attention-history' }
        ]
      }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 AaronAust1n'
    }
  }
})
