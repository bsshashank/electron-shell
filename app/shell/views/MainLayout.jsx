// @flow

import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import { Link } from 'react-router'

import { Layout, Menu, Breadcrumb, Icon } from 'antd'
const { Header, Content, Footer, Sider } = Layout

import { WindowStyle } from '../styles/ControlStyles'

class MainLayout extends Reflux.Component {

  constructor (props, context) {
    super (props, context)
    this.state = {
      collapsed: false,
      mode: 'inline',
    }
  }

  handleTogglePane (collapsed) {
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline'
    })
  }

  navigateTo (route:string) {
    this.props.router.push(route)
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
          <Menu theme="dark" mode={this.state.mode} defaultSelectedKeys={['6']}>
            <Menu.SubMenu
              key="sub1"
              title={<span><Icon type="user" /><span className="nav-text">User</span></span>}
            >
              <Menu.Item key="1">Tom</Menu.Item>
              <Menu.Item key="2">Bill</Menu.Item>
              <Menu.Item key="3">Alex</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu
              key="sub2"
              title={<span><Icon type="team" /><span className="nav-text">Team</span></span>}
            >
              <Menu.Item key="4">Team 1</Menu.Item>
              <Menu.Item key="5">Team 2</Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="6">
              <span>
                <Icon type="file" />
                <span className="nav-text">File</span>
              </span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '12px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
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
