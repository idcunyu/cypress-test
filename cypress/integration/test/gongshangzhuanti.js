var zhuantiURL = 'https://cs.test.zbjdev.com/zt/gszc?cypress-test-yjj=1'
var adminUrl = 'https://admin.cs.test.zbjdev.com/chance/manage'
var dianhuahaoma = '18387878303'
var shangjishijian = ''
var cityName = '广州市'
var cityShouzimu = 'G' // cityShouzimu是cityName的拼音首字母大写
var gongsiming = '重庆自动化测试公司'
var reloadNum  = 0
var reloadNumMax = 15     //admin商机页面报系统错误最大刷新次数
var clickNum = 0
var clickNumMax = 15      //admin商机列表点击商机,弹出系统错误提示，重新点击，最大点击次数

var adminIsLogin = false //admin是否已登陆过

//在admin中验证商机方法
function checkInAdmin() {         
  Cypress.Cookies.debug(true)

  cy.visit(adminUrl).wait(2000) //进入admin（首次进入会跳到boss，非首次则直接进入）

  if (!adminIsLogin) { // 首次登陆需要等待跳转到boss后执行输入账号密码登录
    cy.get('#ember10').type('yangwei')
      .get('#ember11').type('123456')
      .get('#ember12').click()
      .wait(2000)
  }

  cy.url().should('include',adminUrl)
  adminIsLogin = true//登陆成功后设为true，避免再次cy.get('#ember10')，因为不跳转到boss登录页，ember10是找不到的，会报错

  //方法：检查是否系统错误，报错就刷新，刷新15次，直到不报错
  function jianchashuaxin () {
    cy.get('div').then((a) => {   
      var b = a.filter('.error-404')
      if (b.length) {
         if(reloadNumMax > reloadNum  ){
          reloadNum++
          cy.log('当前使用次数', reloadNum)
          cy.reload().then(jianchashuaxin)
         }
         else{
          reloadNum  = 0
          throw new Error('页面系统错误刷新多次后仍无法打开,请手动检查')
         }
      }
      else{ 
        reloadNum  = 0
      }
    })
  }
  
  jianchashuaxin() //调用系统错误刷新方法
  cy.log('当前使用次数', reloadNum)


  cy.get('.input-with-select .el-input > .el-input__inner').click() 
    .get('.el-select-dropdown__item').contains('手机号码').click()
    .get('.input-with-select > :nth-child(2)').clear().type(dianhuahaoma) //使用提交的电话号码查询
  cy.log('admin查询手机号', dianhuahaoma)
    .get('.el-input-group__append .el-button' ).click() 
  cy.get('.el-range__close-icon').trigger('mouseover')
    .get('.el-range__close-icon').click()    
    .wait(1000)//点击后涉及调用接口，需要设置等待

  cy.get('.el-table__body-wrapper .el-table__row:nth-of-type(1) .el-table_1_column_3 .cell') //找到筛选出来的商机列表第一行（代表商机状态的元素）
    .then((a) => {
      if (a.length) {
        if (a.text() === '未领取' || a.text() === '跟进中') {
          //方法：点击后没有从右边划出信息框，则重试
          function chongxindianji() {          //如果遇见弹出系统错误，会重新点击这个商机的方法
            a.click()
            //点击后涉及调用接口，需要设置等待
            cy.wait(1000).get('div').then(b => {
              var c = b.filter('.chance-info-content')
              if(!c.length) {
                if(clickNum < clickNumMax){
                  clickNum++
                  cy.log('当前使用次数', clickNum)
                  chongxindianji()
                }
                else{
                  clickNum = 0
                  throw new Error('在admin点击商机,弹出系统错误提示,已重试多次,忍无法显示商机信息弹窗-请手动检查')
                }     
              }
              else{
                clickNum = 0
              }
            })
          }
          //调用方法
          chongxindianji()
          cy.log('当前使用次数', clickNum)

        } else {
          throw new Error('admin商机列表入库失败')
        }
      } else {
        throw new Error('admin商机列表入库失败')
      }
    })
    
    .get('.chance-info-content .chance-follow-list .chance-follow-item:nth-of-type(1) .follow-source-info .source-info-item')//获取到第一个日志内容
    .each(ele => {
      var label = ele.find('.info-content')
      if (ele.text().trim().includes('提交页面URL')) {
        cy.log('admin商机入库提交页面URL', label.text().trim())
        expect(label.text().trim()).to.has.string(zhuantiURL)
      }
      if (ele.text().trim().includes('需求提交时间')) {
        var submitTime = new Date(label.text().trim()).getTime()  //拿到当前商机入库时间转化为时间戳
        cy.log('admin商机入库需求提交时间和前台客户点击提交时间', new Date(submitTime).getMilliseconds(),new Date(submitTime).toLocaleString(),new Date(shangjishijian).getMilliseconds(),new Date(shangjishijian).toLocaleString())

        //预期上下浮动2000毫秒
        expect(submitTime).to.be.within(shangjishijian - 2000, shangjishijian + 2000)
        
      }
    })
    .log('----商机提交验证成功----')
}

//banner提交商机按钮方法
function shangjitijiaoBanner(anniuleiming) {
  cy.get('.private-policy > .zbj-private-policy-checkbox .el-checkbox__input') // 找到隐私协议勾选框
    .then(($div)=>{                                                    
      var a = $div.filter('.is-checked')
      if (!a.length){
        cy.log('当前没有勾选隐私保护协议')
        $div.click()
        cy.log('点击勾选隐私保护协议')
      } else {
        cy.log('当前已勾选隐私保护协议')
      }
    })
    //选择框和输入框-开始
    .get('.cs-common-city-selected > .el-input__inner').click({force: true})
    .get('.cate > .cate-item').contains(cityShouzimu)
    .click({force: true})
    .log('已选择首字母为F的城市列表')
    .get('.city-items > li').contains(cityName)
    .click({force: true})
    .log('已选择城市广州市')
    .get('.input_company > .el-input > .el-input__inner').clear({force: true}).type(gongsiming, {force: true})
    .get('.input_phone > .el-input > .el-input__inner').clear({force: true}).type(dianhuahaoma, {force: true})
    .log('前台提交手机号',dianhuahaoma)
    //选择框和输入框-结束
    .get(anniuleiming).scrollIntoView({offset: {top: -300}, duration: 500}).click({force: true}) //点击提交按钮
    .then(() => {
      shangjishijian = new Date().getTime()
      cy.log('前台页面客户点击商机提交按钮时间：', new Date(shangjishijian).getMilliseconds())
    })
    .wait(2000)
   
  cy.get('.cs-common-success-dialog-wrap')   //找到商机提交成功弹窗
    .then(($div)=>{
    var b = $div.filter('.show')
    if (b.length) {
      cy.log('商机提交成功');
      cy.get('.cs-success-dialog-center > .icon-close').click({force: true}) //关闭成功弹窗
      checkInAdmin()  //调用admin商机验证方法
    } else {
      cy.log('商机提交失败');
      cy.get('.el-message__content').then($div => { // 找操作频繁导致失败的警告提示元素
        expect($div).to.have.length(1); 
        
        cy.log('当前手机号提交过于频繁导致提交失败')
        dianhuahaoma = String(Number(dianhuahaoma)+1)
        shangjitijiaoBanner(anniuleiming)
      })
    }
  })
}

//页面通用提交商机按钮方法
function shangjitijiao(anniuleiming, loucengleiming) {
  cy.get(anniuleiming).scrollIntoView({offset: {top: -300}, duration: 500}).click({force: true})    //点击商机按钮
    .get(loucengleiming+' .qual-dialog-discount__input > .el-input > .el-input__inner').clear().type(dianhuahaoma)
    .log('前台提交手机号',dianhuahaoma)
    .get(loucengleiming+' .policy > .zbj-private-policy-checkbox .el-checkbox__input')  //找到隐私保护协议框
    .then(($div)=>{
      var a = $div.filter('.is-checked')
      if (!a.length){
        cy.log('当前没有勾选隐私保护协议')
        $div.click()
        cy.log('点击勾选隐私保护协议')
      } else {
        cy.log('当前已勾选隐私保护协议')
      }

    })
    .get(loucengleiming+' .qual-dialog-discount__btn').click({force: true})  //点击商机弹窗框提交按钮
    .then(() => {                                   
      shangjishijian = new Date().getTime()     //提交后，获取当前的时间
      cy.log('前台页面客户点击商机提交按钮时间',new Date(shangjishijian).getMilliseconds())
    })
    .wait(2000)
      
  cy.get('.cs-common-success-dialog-wrap').then(($div)=>{    //判断商机提交成功反馈弹窗框是否出现
    var b = $div.filter('.show')
    if (b.length) {
      cy.log('商机提交成功');
      cy.get('.cs-success-dialog-center > .icon-close').click({force: true}) //关闭成功弹窗
      checkInAdmin()
    } else {
      cy.log('商机提交失败');
      cy.get('.el-message__content').then($div => { // 寻找操作频繁导致失败的警告提示元素
        expect($div).to.have.length(1); //断言失败表示不是因为操作频繁，而是因为接口错误导致的
        
        cy.log('当前手机号提交过于频繁导致提交失败')
        dianhuahaoma = String(Number(dianhuahaoma)+1)
        shangjitijiao(anniuleiming, loucengleiming)
      })
    }
  })
}

describe('PC端工商注册专题页', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })

  beforeEach(() => {
    cy.visit(zhuantiURL)
      .get('#__nuxt', { timeout: 5000 })
      .should('have.length', 1)
    Cypress.Cookies.preserveOnce('PHPSESSID','bossauth','new_userinfo','bossuid','checklogin_time')//保存admin登录信息（实际上是boss登录的信息）
  })

  context ('商机提交验证', () => {
    it ('banner商机提交-查询能否注册按钮商机',() => {
      shangjitijiaoBanner('.btn1')
    })
    it ('banner商机提交-预约注册特惠按钮商机',() => {
      shangjitijiaoBanner('.btn2')
    })

    it ('商机提交-注册公司相关资料楼层',() => {
      shangjitijiao('.left > .content > .tran-btn', '.regist-materials')
    })

    it ('商机提交-注册公司所需费用楼层',() => {
      shangjitijiao('.regist-needmoney ul > li.list-item:nth-of-type(1) .content-btn', '.regist-needmoney')
    })

    it ('商机提交-选择您想要办理的公司类型楼层',() => {
      shangjitijiao('.section-company .detail-wrap .tran-btn', '.section-company')
    })

    it ('商机提交-注册公司办理流程楼层',() => {
      shangjitijiao('.handle-progress .bg-btn', '.handle-progress')
    })

    it ('商机提交-您需要一家可靠的公司代办注册楼层',() => {
      shangjitijiao('.have-bg .reliable-agent .tran-btn', '.have-bg .reliable-agent')
    })

    it ('商机提交-您可以这样选择注册地楼层',() => {
      shangjitijiao('.have-bg .you-can .you-can-main .left .tran-btn', '.have-bg .you-can')
    })

    it ('商机提交-公司注册常见问题楼层',() => {
      shangjitijiao('.common-problem .tran-btn', '.common-problem')
    })

    //Q:优化log
    //Q:添加admin商机判断
    //Q:页面演示时，页面能跟着滑动不
  })
})