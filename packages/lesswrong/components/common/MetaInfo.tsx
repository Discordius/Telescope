import React from 'react';
import { registerComponent } from '../../lib/vulcan-lib';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames'

const styles = (theme) => ({
  root: {
    display: "inline",
    color: theme.palette.grey[600],
    marginRight: theme.spacing.unit,
    fontSize: "1rem"
  },
  button: {
    cursor: "pointer",
    '&:hover, &:active, &:focus': {
      color: theme.palette.grey[400],
    },
  }
})

const MetaInfo = ({children, classes, button, className}: {
  children: React.ReactNode,
  classes: ClassesType,
  button?: boolean,
  className?: string
  title?: string,
}) => {
  return <Typography
    component='span'
    className={classNames(classes.root, {[classes.button]: button}, className)}
    variant='body2'>
      {children}
  </Typography>
}

const MetaInfoComponent = registerComponent('MetaInfo', MetaInfo, {styles});

declare global {
  interface ComponentTypes {
    MetaInfo: typeof MetaInfoComponent
  }
}
