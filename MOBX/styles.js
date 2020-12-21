import { createStyles } from '@material-ui/core/styles'

export const authCodesStyles = theme =>
  createStyles({
    mainWrapper: {
      maxWidth: '100%'
    },
    shortWrapper: {
      maxWidth: 605
    },
    settingsWrapper: {
      maxWidth: 450
    },
    title: {
      [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
        marginBottom: 10
      }
    },
    descriptionWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: -15,
      marginBottom: 30,
      maxWidth: 605,
      [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
        flexDirection: 'column',
        alignItems: 'flex-start'
      }
    },
    description: {
      maxWidth: 545,
      overflow: 'hidden',
      color: '#828282'
    },
    actionBar: {
      margin: '0 0 15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      [theme.breakpoints.down(theme.breakpoints.values.xs)]: {
        flexDirection: 'column',
        alignItems: 'flex-end'
      }
    },
    actionButtonsWrapper: {
      display: 'flex',
      alignItems: 'center',
      '& hr': { height: 40, margin: '0 20px' }
    },
    divider: {
      margin: '0 15px',
      height: 40,
      borderRight: '1px solid #B4BDC2'
    },
    search: {
      maxWidth: 300,
      [theme.breakpoints.down(theme.breakpoints.values.xs)]: {
        maxWidth: '100%',
        marginBottom: 10
      }
    },
    table: {
      margin: '0 0 30px',
      '& th:last-child': {
        fontSize: 0
      },
      '& td:last-child': {
        color: '#828282',
        '& > button': {
          width: '39px'
        },
        '& > button:first-child:hover': {
          color: '#9CC319'
        }
      },
      [theme.breakpoints.down(480)]: {
        '& tbody': {
          '& tr': {
            '& td': {
              '&:first-child': {
                padding: 0,
                paddingTop: 6,
                verticalAlign: theme.direction === 'ltr' ? 'top' : 'middle'
              },
              '&:last-child': {
                paddingTop: 6,
                verticalAlign: theme.direction === 'ltr' ? 'middle' : 'top'
              }
            }
          }
        }
      }
    },
    usersTable: {
      '& tbody td': {
        overflow: 'hidden'
      },
      '& tbody td:first-child, & thead th:first-child': {
        padding: '6px 0',
        width: '60px !important',
        borderLeft: '1px solid #E6EDF1',
        textAlign: 'right'
      },
      [theme.breakpoints.down(867)]: {
        '& .main-table table': {
          borderSpacing: '0 12px',
          borderCollapse: 'separate',
          overflow: 'hidden'
        },
        '& tbody': {
          '& tr': {
            verticalAlign: 'top',
            '& td': {
              overflow: 'visible'
            }
          },
          '& td:first-child': {
            padding: '6px 0',
            width: '44px !important',
            borderLeft: '1px solid #E6EDF1'
          },
          '& td:nth-child(2)': {
            [theme.breakpoints.down(480)]: {
              borderRight: '1px solid #E6EDF1'
            }
          },
          '& td:last-child': {
            padding: '6px 5px 0 0 !important',
            borderRight: '1px solid #E6EDF1',
            [theme.breakpoints.down(480)]: {
              display: 'none'
            }
          }
        }
      }
    }
  })

export const tableCardStyles = () =>
  createStyles({
    cardWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '15px 16px',
      paddingLeft: 0
    },
    cardCount: {
      color: '#828282',
      margin: '0px 15px'
    },
    cardInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      flexGrow: 1
    },
    cardActions: {
      display: 'flex',
      alignSelf: 'flex-end',
      alignItems: 'center',
      '&:first-child': {
        marginLeft: 0
      },
      '&:last-child': {
        marginRight: 0
      }
    },
    itemWrapper: {
      display: 'flex',
      alignItems: 'center',
      color: '#B4BDC2',
      marginBottom: 10
    },
    itemText: {
      marginLeft: 10,
      color: '#333333'
    },
    name: {
      marginBottom: 5
    },
    actionBtn: {
      color: '#828282',
      cursor: 'pointer',
      margin: '0 10px'
    },
    phoneNumberWrapper: {
      display: 'flex',
      color: '#828282'
    },
    phoneNumberContent: {
      marginLeft: 13,
      color: '#333333'
    },

    phoneNumber: {
      whiteSpace: 'nowrap',
      marginLeft: 13
    },
    divider: {
      height: 20
    }
  })

export const userTableCardStyles = createStyles({
  wrapper: {
    position: 'relative',
    backgroundColor: 'white'
  }
})

export const headerStyles = createStyles({
  header: {
    padding: '15px 50px 15px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    '& .idx': {
      margin: '3px 6px 0 0',
      fontSize: '1.2rem'
    }
  },
  headerPhoneNumber: {
    margin: '0 15px'
  }
})

export const detailsPanelStyles = createStyles(theme => ({
  detail: {
    padding: '14px 0 10px 0',
    display: 'none',
    position: 'relative',
    '&:before': {
      display: 'block',
      content: '""',
      borderTop: '1px solid #E6EDF1',
      left: 0,
      top: 0,
      position: 'absolute',
      width: '100%'
    }
  },
  row: {
    padding: '0 6px 0 16px',
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    columnGap: '6px',
    rowGap: '14px',
    [theme.breakpoints.down(480)]: {
      gridTemplateColumns: '100%'
    }
  },
  footer: {
    display: 'none',
    [theme.breakpoints.down(480)]: {
      display: 'block',
      borderTop: '1px solid #E6EDF1',
      overflow: 'hidden',
      padding: '12px 6px 0 16px'
    }
  },
  deleteBtn: {
    margin: '0 -3px',
    color: '#828282',
    fontSize: '1.6rem',
    lineHeight: '2.4rem',
    cursor: 'pointer',
    '& > *': {
      margin: '0 3px',
      display: 'inline-block',
      verticalAlign: 'middle'
    }
  },
  checkbox: {
    display: 'none',
    '&:checked': {
      '& ~ .detail': {
        display: 'block'
      },
      '& + label svg': {
        transform: 'translate(-50%, -50%) rotate(270deg)'
      }
    }
  },
  label: {
    display: 'block',
    width: 30,
    height: 30,
    borderRadius: 2,
    boxShadow: '0px 4px 8px #EBEBEB',
    color: theme.palette.primary.main,
    position: 'absolute',
    top: 10,
    right: 10,
    cursor: 'pointer',
    '& svg': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(90deg)',
      transition: 'transform .2s linear'
    }
  }
}))

export const cellStyles = createStyles(theme => ({
  cell: {
    margin: '0 0 14px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    [theme.breakpoints.down(480)]: {
      width: '100%'
    }
  },
  icon: {
    display: 'flex',
    alignSelf: 'center',
    flexShrink: 0,
    marginRight: 5,
    color: '#B4BDC2'
  }
}))
