import React, { createContext, Component } from 'react';

export const StoreContext = createContext({
    username: "",
    setUsername: () => { }
});

/**
 * Déclaration et initialisation du contexte
 * 
 * Note : Il n'est pas nécessaire qu'il soit le composant de premier niveau de la fonction render.
 * 
 * Utilisation: 
 * 
 *      class App extends Component {
 *          // (...)
 * 
 *          render(){
 *              return (
 *                 <div>
 *                      (...)
 *                      <StoreProvider>
 *                          (...)
 *                      </StoreProdiver> 
 *                      (...)
 *                 </div>
 *              );
 *          }
 *      }
 * 
 */
class StoreProvider extends Component {
    state = {
        pseudo: "John Doe",
        setUsername: (username) => {
            if ( username != null && username !== '' ) {// Note: != au lieu de !== permet de vérifier que la variable n'est ni null ni undefined
                this.setState({
                    username: username
                });
            }
        }
    }

    render() {
        return (
            <StoreContext.Provider value={this.state}>
                {this.props.children}
            </StoreContext.Provider>
        );
    }
}

/**
 * Couche d'abstraction pour simplifier l'utilisation du contexte dans un composant.
 * 
 * Tout composant utilisant ce contexte doit être lui-même descendant (direct ou non) d'un composant StoreProvider.
 * 
 * Utilisation :
 * 
 *      // (...)
 *      import { withStore } from '{chemin}/StoreProvider';
 * 
 *      class MonComposant extends React.Component {
 *          // (...)
 *      }
 * 
 *      export default withStore(MonComposant);
 * 
 * 
 * @param {*} Component Le composant qui utilisera ce contexte
 * @return le composant après ajout du contenu contexte dans la liste de ses props
 */
export const withStore = Component => props => (
    <StoreContext.Consumer>
        {store => <Component {...props} {...store} />}
    </StoreContext.Consumer>
);

export default StoreProvider;
