describe('TO-DO app', () => {
  const Texto1 = 'Tarefa numero 1';
  const Texto2 = 'Tarefa numero 2';
  const Texto3 = 'Tarefa numero 3';

  beforeEach(() => {
      cy.visit('http://127.0.0.1:5500/');
      cy.get('#todo_title').type(Texto1);
      cy.get('.btn-primary').click();
      cy.get('#todo_title').type(Texto2);
      cy.get('.btn-primary').click(); 
      cy.get('#todo_title').type(Texto3);
      cy.get('.btn-primary').click();
  })
  it('Verifica se o usuário consegue cadastrar tarefas sem titulo', () => {
      cy.window().then(win => {
          cy.stub(win, 'alert').as('windowAlert');
      });
      cy.get('.btn-primary').click();
      cy.get('@windowAlert').should('have.been.calledWith', 'Digite um título para a tarefa!');
  });
  it('Verifica se o usuário possui tarefas', () => {
      cy.get('tbody')
        .find('tr:not(.completed)')
        .should('have.length', 3)
        .should('contain', Texto1)
        .should('contain', Texto2)
        .should('contain', Texto3);
  });
  it('Marca uma tarefa como Finalizada', () => {
      cy.contains('td', Texto1)
        .parent()
        .within(() => {
          cy.get('input[type="checkbox"]').check();
        });
      cy.contains('td', Texto1)
        .parent()
        .should('have.class', 'completed');
  });
  it('Desmarca uma tarefa como Finalizada', () => {
      cy.contains('td', Texto1)
        .parent()
        .within(() => {
          cy.get('input[type="checkbox"]').check();
        });
      cy.contains('td', Texto1)
        .parent()
        .should('have.class', 'completed');

      cy.contains('td', Texto1)
        .parent()
        .within(() => {
          cy.get('input[type="checkbox"]').uncheck();
        });
      cy.contains('td', Texto1)
        .parent()
        .should('not.have.class', 'completed');
    });
    context('Habilita o cliente a poder', () => {
      beforeEach(() => {
        cy.contains('td', Texto1)
          .parent()
          .within(() => {
            cy.get('input[type="checkbox"]').check();
      });
    })

    it('Filtra as tarefas que ainda não foram finalizadas', () => {
        cy.get('select').select('Em aberto');
        cy.get('tbody')
          .find('tr:not(.completed)')
          .should('have.length', 2)
          .should('contain', Texto2)
          .should('contain', Texto3);
    });

    it('Filtra as tarefas que já foram finalizadas', () => {
        cy.get('select').select('Concluídos');
        cy.get('tbody')
          .find('tr.completed')
          .should('have.length', 1)
          .should('contain', Texto1);
    });

    it('Excluir uma terefa já concluída', () => {
        cy.get('.table tbody tr.completed input[type="checkbox"]').first().check();
        cy.get('.table tbody tr.completed button.btn-danger').first().click();
        cy.contains('Pay electric bill').should('not.exist');
    })
  })
})