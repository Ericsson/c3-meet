import React, {Component} from 'react'
import {connect} from 'react-redux'
import {FlatButton, RaisedButton, TextField} from 'material-ui'

import ConfigFull from '../images/config_full.png'
import ConfigSwitchOnly from '../images/config_sw_only.png'
import ConfigAudioOnly from '../images/config_audio_only.png'

const styles = {
  container: {
    width: '100vw',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '10vh',
  },
  configButton: {
    width: 220,
    height: 150,
    marginLeft: 20,
    marginRight: 20,
  },
  configImage: {
    height: '100%',
    maxWidth: '100%',
    WebkitFilter: 'invert(100%) brightness(200%)',
  },
}

class SetupPage extends Component {
  render () {
    return (
      <div>
        <div style={styles.container}>
          <FlatButton style={styles.configButton}>
            <img src={ConfigFull} style={styles.configImage}/>
          </FlatButton>
          <FlatButton style={styles.configButton}>
            <img src={ConfigSwitchOnly} style={styles.configImage}/>
          </FlatButton>
          <FlatButton style={styles.configButton}>
            <img src={ConfigAudioOnly} style={styles.configImage}/>
          </FlatButton>
        </div>
        <div style={styles.container}>
          <TextField hintText="monkey-balls"/>
          <RaisedButton label="Join" labelColor="black"/>
        </div>
      </div>
    )
  }
}

SetupPage.propTypes = {
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(SetupPage)
