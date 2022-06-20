context('admin', () => {
  it('test1', () => {

    cy.visit('http://admin.cs.test.zbjdev.com/chance/manage')
      .wait(2000)
      .get('#ember10').type('yangwei')
      .get('#ember11').type('123456')
      .get('#ember12').click()
      .wait(2000)

    cy.url().should('include', 'https://admin.cs.test.zbjdev.com/chance/manage')


    cy.get('.input-with-select .el-input__inner').click()
      .get('.el-select-dropdown__item').contains('手机号码').click()
      .get('.input-with-select > :nth-child(2)').type('15111100001')
      .get('.el-input-group__append .el-button').click()
    cy.get('.el-range__close-icon').trigger('mouseover')
      .get('.el-range__close-icon').click()

    cy.get('.el-table__body-wrapper tbody .el-table__row')
      .each(function ($el, index, $table) {
        if ($el.text().includes('')) {
          $table.eq(index).find('').click()
        }
      })
  })
})