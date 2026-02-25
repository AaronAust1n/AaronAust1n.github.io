import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "AaronAust1n",
  description: "A Liquid Glass Style Blog",
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  
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
          { text: '投票', link: '/zh/vote' }
        ],

        sidebar: [
          {
            text: '最近更新',
            items: [
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
      { text: 'Vote', link: '/vote' }
    ],

    sidebar: [
      {
        text: 'Recent Posts',
        items: [
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
