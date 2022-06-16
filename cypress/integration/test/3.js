let dianhuahaoma = '13787878303'
let cityName = '广州市'
let cityShouzimu = 'G' // cityShouzimu为cityName的拼音首字母大写

//banner提交商机按钮方法
function shangjitijiaoBanner(anniuleiming) {
  cy.get('.private-policy .el-checkbox__input') // 找到隐私协议勾选框
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
    .get('.input_company > .el-input > .el-input__inner').clear().type('重庆自动化测试公司', {force: true})
    .log('当前：', dianhuahaoma)
    .get('.input_phone > .el-input > .el-input__inner').clear().type(dianhuahaoma, {force: true})
    //选择框和输入框-结束
    .get(anniuleiming).click({force: true}) //点击提交按钮
    .wait(2000)
   
  cy.get('.cs-common-success-dialog-wrap').then(($div)=>{
    let b = $div.filter('.show')
    if (b.length) {
      cy.log('商机提交成功');
      cy.get('.cs-success-dialog-center > .icon-close').click({force: true}) //关闭成功弹窗
    } else {
      cy.log('商机提交失败');
      cy.get('.el-message__content').then($div => {
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
    .get(loucengleiming+' .policy > .zbj-private-policy-checkbox > .base-checkbox > .el-checkbox > .el-checkbox__input')
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
    let b = $div.filter('.show')
    if (b.length) {
      cy.log('商机提交成功');
      cy.get('.cs-success-dialog-center > .icon-close').click({force: true}) //关闭成功弹窗
    } else {
      cy.log('商机提交失败');
      cy.get('.el-message__content').then($div => {
        expect($div).to.have.length(1); //断言失败表示不是因为操作频繁，而是因为接口错误导致的
        
        cy.log('操作过于频繁导致提交失败')
        dianhuahaoma = String(Number(dianhuahaoma)+1)
        shangjitijiao(anniuleiming, loucengleiming)
      })
    }
  })
}

describe('PC端工商注册专题页', () => {
  context ('商机提交验证', () => {
    it ('01',() => {
      cy.visit('https://cs.test.zbjdev.com/zt/gszc')
        .get('#__nuxt', { timeout: 5000 })
        .should('have.length', 1)
        
      //banner商机提交-查询能否注册按钮商机
      shangjitijiaoBanner('.btn1')
      //banner商机提交-预约注册特惠按钮商机
      shangjitijiaoBanner('.btn2')

      //商机提交-注册公司相关资料楼层
      shangjitijiao('.left > .content > .tran-btn', '.regist-materials')

      //商机提交-注册公司所需费用楼层
      shangjitijiao('.regist-needmoney ul > li.list-item:nth-of-type(1) .content-btn', '.regist-needmoney')
    
      //商机提交-选择您想要办理的公司类型楼层
      shangjitijiao('.section-company .detail-wrap .tran-btn', '.section-company')

      //商机提交-注册公司办理流程楼层
      shangjitijiao('.handle-progress .bg-btn', '.handle-progress')

      //商机提交-您需要一家可靠的公司代办注册楼层
      shangjitijiao('.have-bg .reliable-agent .tran-btn', '.have-bg .reliable-agent')

      //商机提交-您可以这样选择注册地楼层
      shangjitijiao('.have-bg .you-can .you-can-main .left .tran-btn', '.have-bg .you-can')

      //商机提交-公司注册常见问题楼层
      shangjitijiao('.common-problem .tran-btn', '.common-problem')

      //Q:手机号提交频繁后有限制？
      //Q:需要每个商机都写吗？

    })
  })
})