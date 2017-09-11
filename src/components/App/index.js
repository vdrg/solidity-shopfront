import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Menu, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

// Menu item component
const MenuItem = ({ name, icon, text, path, to }) =>
  <Menu.Item
    as={Link}
    to={to}
    name={name}
    active={to === path}
  >
    <Icon name={icon} />
    {text}
  </Menu.Item>;

class App extends Component {

  state = { 
    visible: true,
    selected: 'home'
  }; 

  toggleVisibility = () => this.setState({ visible: !this.state.visible });

  handleItemClick = (e, { name: selected }) => this.setState({ selected });

  render() {
    const { location } = this.props;

    const { pathname } = location;
    return (
      <div>
        <Menu style={styles.sidebar} fixed='left' size='large' icon='labeled' vertical inverted>
            <MenuItem
              to='/'
              path={pathname}
              name='home'
              icon='shopping bag'
              text='Home'
            />
            <MenuItem
              to='/merchant'
              path={pathname}
              name='merchant'
              icon='user'
              text='Merchant'
            />
            <MenuItem
              to='/purchases'
              path={pathname}
              name='purchases'
              icon='book'
              text='Purchases'
            />
          </Menu>
          <div style={styles.content}>
            {this.props.children}
          </div>
      </div>
    );
  }
}

const styles = {
  container: {
    //height: '100%',
  },
  sidebar: {
    //height: '100%',
    width: 250,
  },
  content: {
    // overflowY: 'scroll',
    marginLeft: 250,
    height: '100vh',
  },
  sidebarButton: {
    background: 'none',
  }
}

export default withRouter(App);
