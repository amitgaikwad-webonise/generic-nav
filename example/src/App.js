import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Timer from 'simple-react-timer'
import DRFNavigation from 'generic-nav';
class App extends Component {
  render () {
    const now = new Date()
    const fourHours = new Date().setHours(now.getHours() + 4)

    return (
      <DRFNavigation></DRFNavigation>
    )
  }
}

export default App
