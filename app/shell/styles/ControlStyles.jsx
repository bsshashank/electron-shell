// @flow

export const WindowStyle = {
  padding: '0 0 0.8em',
  margin: 0,
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  WebkitUserSelect: 'none'
}

export const appTitleStyle = {
  WebkitUserSelect: 'none',
  cursor: 'default',
  paddingLeft: '10px',
  fontSize: '12px'
}

export const dragStyle = {
  WebkitAppRegion: 'drag',
  height: '100%',
  flex: 1
}

export const winIconStyle = {
  width: '0.8em',
  height: '0.8em',
  ':hover': {
    opacity: 100
  }
}

export const winButtonStyle = {
  base: {
    height: '24px',
    width: '36px',
    borderRadius: '10%',
    marginTop: 0,
    marginBottom: 0,
    minWidth: 0,
    paddingLeft: '0.8em',
    ':active': {
      backgroundColor: 'rgba(255, 255, 255, .23)'
    },
    ':hover': {
      transition: 'background-color 0.1s',
      backgroundColor: 'rgba(0, 0, 0, .13)'
    }
  },
  close: {
    ':active': {
      backgroundColor: '#f1707a'
    },
    ':hover': {
      transition: 'background-color 0.1s',
      backgroundColor: '#e81123'
    }
  }
}

export const osxIconStyle = {
  opacity: 0,
  width: '6px',
  height: '6px',
  marginTop: '2px',
  marginLeft: '2px',
  ':hover': {
    opacity: 100
  }
}

export const osxButtonStyle = {
  base: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginBottom: '0.5px',
    marginLeft: '4px',
    marginRight: '4px',
    lineHeight: 0
  },
  close: {
    backgroundColor: '#ff5f57',
    borderColor: '#e2463f',
    ':active': {
      backgroundColor: '#bf4943',
      borderColor: '#ad3934'
    }
  },
  minimize: {
    backgroundColor: '#ffbd2e',
    borderColor: '#e1a116',
    ':active': {
      backgroundColor: '#bf9123',
      borderColor: '#ad7d15'
    }
  },
  maximize: {
    backgroundColor: '#28c940',
    borderColor: '#12ac28',
    ':active': {
      backgroundcolor: '#1f9a31',
      borderColor: '#128622'
    }
  }
}

export const TitleBarStyle = {
  height: '24px',
  flex: 1,
  alignContent: 'flex-end',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
  display: 'flex',
  padding: '2px',
  backgroundColor: '#f2f2f2'
}
