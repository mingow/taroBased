Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#f66e62",
    list: [{
      pagePath: 'pages/index/index',
      iconPath: "/assets/images/shop.png",
      selectedIconPath: "/assets/images/shop-fill.png",
      text: "首页"
    },
    {
      pagePath: "pages/index/index",
      iconPath: "/assets/images/bell.png",
      selectedIconPath: "/assets/images/bell-fill.png",
      text: "通知"
    },
    {
      pagePath: "pages/index/index",
      iconPath: "/assets/images/message.png",
      selectedIconPath: "/assets/images/message-fill.png",
      text: "留言"
    },
    {
      pagePath: "pages/index/index",
      iconPath: "/assets/images/user.png",
      selectedIconPath: "/assets/images/user-fill.png",
      text: "会员"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})
