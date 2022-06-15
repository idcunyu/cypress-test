context ('创建优惠劵用例',()=>{

  it ('登录admin后台',()=> {

     cy.visit('http://admin.cs.test.zbjdev.com')

     cy.get('#ember10').type('yangwei')

     cy.get('#ember11').type('123456')
 
     cy.get('.btn btn-primary btn-block btn-lg async-button default ember-view').click()




  })


})