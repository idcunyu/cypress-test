var dianhuahaoma = '18387878301'
var cityName = '广州市'
var cityShouzimu = 'G' // cityShouzimu是cityName的拼音首字母大写
var gongsiming = '重庆自动化测试公司'

//banner提交商机按钮方法
function shangjitijiaoBanner(anniuleiming) {
  cy.get('.private-policy > .zbj-private-policy-checkbox .el-checkbox__input') // 找到隐私协议勾选框
    .then(($div)=>{
      var a = $div.filter('.is-checked')
      if (!a.length){
        cy.log('没有勾选')
        $div.click()
      }
    })
    //选择框和输入框-开始
    .get('.cs-common-city-selected > .el-input__inner').click({force: true})
    .get('.cate > .cate-item').contains(cityShouzimu).click({force: true})
    .get('.city-items > li').contains(cityName).click({force: true})
    .get('.input_company > .el-input > .el-input__inner').clear().type(gongsiming, {force: true})
    .get('.input_phone > .el-input > .el-input__inner').clear().type(dianhuahaoma, {force: true})
    //选择框和输入框-结束
    .get(anniuleiming).click({force: true}) //点击提交按钮
    .wait(2000)
   
  cy.get('.cs-common-success-dialog-wrap').then(($div)=>{
    var b = $div.filter('.show')
    if (b.length) {
      cy.log('商机提交成功');
      cy.get('.cs-success-dialog-center > .icon-close').click({force: true}) //关闭成功弹窗
    } else {
      cy.log('商机提交失败');
      cy.get('.el-message__content').then($div => { // 寻找操作频繁导致失败的警告提示元素
        expect($div).to.have.length(1); //断言失败表示不是因为操作频繁，而是因为接口错误导致的
        
        cy.log('操作过于频繁导致提交失败')
        dianhuahaoma = String(Number(dianhuahaoma)+1)
        shangjitijiaoBanner(anniuleiming)
      })
    }
  })
}

//页面通用提交商机按钮方法
function shangjitijiao(anniuleiming, loucengleiming) {
  cy.get(anniuleiming).click({force: true})
    .get(loucengleiming+' .qual-dialog-discount__input > .el-input > .el-input__inner').clear().type(dianhuahaoma)
    .get(loucengleiming+' .policy > .zbj-private-policy-checkbox .el-checkbox__input')
    .then(($div)=>{
      var a = $div.filter('.is-checked')
      if (!a.length){
        cy.log('没有勾选')
        $div.click()
      }
    })
    .get(loucengleiming+' .qual-dialog-discount__btn').click({force: true})
    .wait(2000)
      
  cy.get('.cs-common-success-dialog-wrap').then(($div)=>{
    var b = $div.filter('.show')
    if (b.length) {
      cy.log('商机提交成功');
      cy.get('.cs-success-dialog-center > .icon-close').click({force: true}) //关闭成功弹窗
    } else {
      cy.log('商机提交失败');
      cy.get('.el-message__content').then($div => { // 寻找操作频繁导致失败的警告提示元素
        expect($div).to.have.length(1); //断言失败表示不是因为操作频繁，而是因为接口错误导致的
        
        cy.log('操作过于频繁导致提交失败')
        dianhuahaoma = String(Number(dianhuahaoma)+1)
        shangjitijiao(anniuleiming, loucengleiming)
      })
    }
  })
}

describe('PC端工商注册专题页', () => {
  beforeEach(() => {
    cy.visit('https://cs.test.zbjdev.com/zt/gszc')
      .get('#__nuxt', { timeout: 5000 })
      .should('have.length', 1)
  })

  context ('商机提交验证', () => {
    it ('banner商机提交-查询能否注册按钮商机',() => {
      //banner商机提交-查询能否注册按钮商机
      shangjitijiaoBanner('.btn1')
    })
    it ('banner商机提交-预约注册特惠按钮商机',() => {
      //banner商机提交-预约注册特惠按钮商机
      shangjitijiaoBanner('.btn2')
    })

    it ('商机提交-注册公司相关资料楼层',() => {
      //商机提交-注册公司相关资料楼层
      shangjitijiao('.left > .content > .tran-btn', '.regist-materials')
    })

    it ('商机提交-注册公司所需费用楼层',() => {
      //商机提交-注册公司所需费用楼层
      shangjitijiao('.regist-needmoney ul > li.list-item:nth-of-type(1) .content-btn', '.regist-needmoney')
    })

    it ('商机提交-选择您想要办理的公司类型楼层',() => {
      //商机提交-选择您想要办理的公司类型楼层
      shangjitijiao('.section-company .detail-wrap .tran-btn', '.section-company')
    })

    it ('商机提交-注册公司办理流程楼层',() => {
      //商机提交-注册公司办理流程楼层
      shangjitijiao('.handle-progress .bg-btn', '.handle-progress')
    })

    it ('商机提交-您需要一家可靠的公司代办注册楼层',() => {
      //商机提交-您需要一家可靠的公司代办注册楼层
      shangjitijiao('.have-bg .reliable-agent .tran-btn', '.have-bg .reliable-agent')
    })

    it ('商机提交-您可以这样选择注册地楼层',() => {
      //商机提交-您可以这样选择注册地楼层
      shangjitijiao('.have-bg .you-can .you-can-main .left .tran-btn', '.have-bg .you-can')
    })

    it ('商机提交-公司注册常见问题楼层',() => {
      //商机提交-公司注册常见问题楼层
      shangjitijiao('.common-problem .tran-btn', '.common-problem')
    })

    //Q:手机号提交频繁后有限制？
    //Q:需要每个商机都写吗？

  })
})