// @flow

import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import { Link } from 'react-router'

import { WindowStyle } from '../styles/ControlStyles'

class MainLayout extends Reflux.Component {

  constructor (props, context) {
    super (props, context)
    this.state = {
      activeModule: 'Home',
      collapsed: true
    }
  }

  handleTogglePane (collapsed) {
    this.setState({
      collapsed
    })
  }

  navigateTo ({ key }) {
    if (key === '.$1') {
      this.setState({ activeModule: 'Home' })
      this.props.router.push('/')
    } else if (key === '.$2') {
      this.setState({ activeModule: 'Settings'})
      this.props.router.push('settings')
    }
  }

  render () {
    let routes = []

    /* extensions.push(
      <Link to={extension.path} key={extension.path}>
        <Icon name={extension.module.config.icon} style={{ paddingRight: '10px' }} />
        {extension.module.config.label}
      </Link>
    ) */
    return (
      <Layout id='mainLayout' style={WindowStyle}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.handleTogglePane.bind(this)}
        >
          <div className="logo" />
          <Menu theme="dark" mode={this.state.mode} defaultSelectedKeys={['1']}
                onClick={this.navigateTo.bind(this)}>
            <Menu.Item key="1">
              <span>
                <Icon type="home" />
                <span className="nav-text">Home</span>
              </span>
            </Menu.Item>
            <Menu.Item key="2">
              <span>
                <Icon type="setting" />
                <span className="nav-text">Settings</span>
              </span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: '0 16px', height: '100%' }}>
            <Breadcrumb style={{ margin: '12px 0' }}>
              <Breadcrumb.Item>{this.state.activeModule}</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360, height: '90%' }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Electron Shell ©2017 Created by Andreas Gerlach
          </Footer>
        </Layout>
      </Layout>
    )
  }
}

export default Radium(MainLayout)
