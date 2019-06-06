import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from '../../lib/reactRouterWrapper.js';
import { Posts } from "../../lib/collections/posts";
import { Sequences } from "../../lib/collections/sequences/collection.js";
import { Collections } from "../../lib/collections/collections/collection.js";
import withErrorBoundary from '../common/withErrorBoundary';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import withUser from "../common/withUser";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Hidden from '@material-ui/core/Hidden';
import NoSSR from 'react-no-ssr';
import withRecordPostView from '../common/withRecordPostView';

import { POSTED_AT_WIDTH } from './PostsItemDate.jsx';

export const MENU_WIDTH = 18
export const KARMA_WIDTH = 42
export const COMMENTS_WIDTH = 48

const COMMENTS_BACKGROUND_COLOR = "rgba(0,0,0,.1)"

const styles = (theme) => ({
  root: {
    position: "relative",
    [theme.breakpoints.down('sm')]: {
      width: "100%"
    },
    [theme.breakpoints.up('md')]: {
      height: 49,
    },
    '&:hover $actions': {
      opacity: .2,
    }
  },
  postsItem: {
    display: "flex",
    paddingTop: theme.spacing.unit*1.5,
    paddingBottom: theme.spacing.unit*1.5,
    alignItems: "center",
    flexWrap: "nowrap",
    [theme.breakpoints.down('sm')]: {
      flexWrap: "wrap",
    },
  },
  background: {
    transition: "3s",
    width: "100%",
  },
  hasResumeReading: {
    ...theme.typography.body,
    "& $title": {
      position: "relative",
      top: -5,
    },
  },
  bottomBorder: {
    borderBottom: "solid 1px rgba(0,0,0,.2)",
  },
  commentsBackground: {
    backgroundColor: COMMENTS_BACKGROUND_COLOR,
    transition: "0s",
  },
  firstItem: {
    borderTop: "solid 1px rgba(0,0,0,.2)"
  },
  karma: {
    width: 42,
    justifyContent: "center",
    [theme.breakpoints.down('sm')]:{
      width: "unset",
      justifyContent: "flex-start",
      marginLeft: 2,
      marginRight: theme.spacing.unit
    }
  },
  title: {
    height: 22,
    flexGrow: 1,
    flexShrink: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginRight: 12,
    [theme.breakpoints.down('sm')]: {
      order:-1,
      height: "unset",
      marginBottom: theme.spacing.unit,
      maxWidth: "unset",
      width: "100%",
      paddingRight: theme.spacing.unit
    },
    '&:hover': {
      opacity: 1,
    }
  },
  author: {
    justifyContent: "flex-end",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis", // I'm not sure this line worked properly?
    marginRight: theme.spacing.unit*1.5,
    [theme.breakpoints.down('sm')]: {
      justifyContent: "flex-start",
      width: "unset",
      marginLeft: 0,
      flex: "unset"
    }
  },
  event: {
    maxWidth: 250,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis", // I'm not sure this line worked properly?
    marginRight: theme.spacing.unit*1.5,
    [theme.breakpoints.down('sm')]: {
      width: "unset",
      marginLeft: 0,
    }
  },
  postedAt: {
    '&&': {
      width: POSTED_AT_WIDTH,
      fontWeight: 300,
      fontSize: "1rem",
      color: "rgba(0,0,0,.9)",
      [theme.breakpoints.down('sm')]: {
        width: "auto",
      }
    }
  },
  newCommentsSection: {
    width: "100%",
    paddingLeft: theme.spacing.unit*2,
    paddingRight: theme.spacing.unit*2,
    paddingBottom: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    cursor: "pointer",
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    }
  },
  closeComments: {
    color: theme.palette.grey[500],
    textAlign: "right",
  },
  commentsIcon: {
    width: COMMENTS_WIDTH,
    height: 24,
    cursor: "pointer",
    position: "relative",
    flexShrink: 0,
    top: 2
  },
  actions: {
    opacity: 0,
    display: "flex",
    position: "absolute",
    top: 0,
    right: -MENU_WIDTH - 6,
    width: MENU_WIDTH,
    height: "100%",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down('sm')]: {
      display: "none"
    }
  },
  actionsMenu: {
    position: "absolute",
    top: 0,
  },
  mobileSecondRowSpacer: {
    [theme.breakpoints.up('md')]: {
      display: "none",
    },
    flexGrow: 1,
  },
  mobileActions: {
    cursor: "pointer",
    width: MENU_WIDTH,
    opacity: .5,
    marginRight: theme.spacing.unit,
    display: "none",
    [theme.breakpoints.down('sm')]: {
      display: "block"
    }
  },
  mobileDismissButton: {
    display: "none",
    opacity: 0.5,
    verticalAlign: "middle",
    marginLeft: 5,
    [theme.breakpoints.down('sm')]: {
      display: "inline-block"
    }
  },
  nextUnreadIn: {
    color: theme.palette.grey[800],
    
    [theme.breakpoints.up('md')]: {
      position: "absolute",
      left: 42,
      top: 30,
      zIndex: 1000,
    },
    [theme.breakpoints.down('sm')]: {
      order: -1,
      width: "100%",
      marginTop: -10,
      marginLeft: 3,
    },
    
    "& a": {
      color: theme.palette.primary.main,
    },
  },
  sequenceImage: {
    marginTop: -12,
    marginBottom: -12,
    top: 4,
    position: "relative",
    marginLeft: -60,
    zIndex: -1,
    opacity: 0.6,
    
    // Overlay a white-to-transparent gradient over the image
    "&:after": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      background: "linear-gradient(to right, white 0%, rgba(255,255,255,.8) 60%, transparent 100%)",
    }
  },
})

const dismissRecommendationTooltip = "Don't remind me to finish reading this sequence unless I visit it again";

class PostsItem2 extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { showComments: props.defaultToShowComments, readComments: false}
    this.postsItemRef = React.createRef();
  }

  toggleComments = (scroll) => {
    this.props.recordPostView({...this.props, document:this.props.post})
    this.setState((prevState) => {
      if (scroll) {
        this.postsItemRef.current.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
      }
      return ({
        showComments:!prevState.showComments,
        readComments: true
      })
    })
  }

  isSticky = (post, terms) => {
    if (post && terms && terms.forum) {
      return (
        post.sticky ||
        (terms.af && post.afSticky) ||
        (terms.meta && post.metaSticky)
      )
    }
  }
  
  hasUnreadComments = () => {
    const { post } = this.props
    const { lastVisitedAt } = post
    const { readComments } = this.state
    const lastCommentedAt = Posts.getLastCommentedAt(post)
    const read = lastVisitedAt;
    const newComments = lastVisitedAt < lastCommentedAt;
    return (read && newComments && !readComments)
  }

  render() {
    const { classes, post, chapter, currentUser, index, terms, resumeReading, showBottomBorder=true, showQuestionTag=true, showIcons=true, showPostedAt=true, defaultToShowUnreadComments=false } = this.props
    const { showComments } = this.state
    const { PostsItemComments, PostsItemKarma, PostsItemTitle, PostsUserAndCoauthors, EventVicinity, PostsPageActions, PostsItemIcons, PostsItem2MetaInfo } = Components

    const postLink = Posts.getPageUrl(post, false, chapter?.sequenceId);
    
    const unreadComments = this.hasUnreadComments()

    const renderComments = showComments || (defaultToShowUnreadComments && unreadComments)
    const condensedAndHiddenComments = defaultToShowUnreadComments && unreadComments && !showComments

    const dismissButton = (resumeReading && <Tooltip title={dismissRecommendationTooltip} placement="right">
        <CloseIcon onClick={() => this.props.dismissRecommendation()}/>
      </Tooltip>
    )
    
    return (
      <div className={classes.root} ref={this.postsItemRef}>
        <div className={classNames(
          classes.background,
          {
            [classes.bottomBorder]: showBottomBorder,
            [classes.commentsBackground]: renderComments,
            [classes.firstItem]: (index===0) && showComments,
            "personalBlogpost": !post.frontpageDate,
            [classes.hasResumeReading]: !!resumeReading,
          }
        )}>
          <div className={classes.postsItem}>
            <PostsItem2MetaInfo className={classes.karma}>
              <PostsItemKarma post={post} />
            </PostsItem2MetaInfo>

            <Link to={postLink} className={classes.title}>
              <PostsItemTitle post={post} postItem2 read={post.lastVisitedAt} sticky={this.isSticky(post, terms)} showQuestionTag={showQuestionTag}/>
            </Link>
            
            {(resumeReading?.sequence || resumeReading?.collection) &&
              <div className={classes.nextUnreadIn}>
                Next unread in <Link to={
                  resumeReading.sequence
                    ? Sequences.getPageUrl(resumeReading.sequence)
                    : Collections.getPageUrl(resumeReading.collection)
                }>
                  {resumeReading.sequence?.title || resumeReading.collection?.title}
                </Link>
                {" "}
                ({resumeReading.numRead}/{resumeReading.numTotal} read)
                
                <div className={classes.mobileDismissButton}>
                  {dismissButton}
                </div>
              </div>
            }

            { post.user && !post.isEvent && <PostsItem2MetaInfo className={classes.author}>
              <PostsUserAndCoauthors post={post} abbreviateIfLong={true} />
            </PostsItem2MetaInfo>}

            { post.isEvent && <PostsItem2MetaInfo className={classes.event}>
              <EventVicinity post={post} />
            </PostsItem2MetaInfo>}

            {showPostedAt && !resumeReading && <Components.PostsItemDate post={post}/>}

            <div className={classes.mobileSecondRowSpacer}/>
            
            {<div className={classes.mobileActions}>
              {!resumeReading && <PostsPageActions post={post} menuClassName={classes.actionsMenu} />}
            </div>}

            {showIcons && <Hidden mdUp implementation="css">
              <PostsItemIcons post={post}/>
            </Hidden>}

            {!resumeReading && <div className={classes.commentsIcon}>
              <PostsItemComments
                post={post}
                onClick={() => this.toggleComments(false)}
                unreadComments={unreadComments}
              />
            </div>}
            
            {resumeReading &&
              <div className={classes.sequenceImage}>
                <NoSSR>
                  <Components.CloudinaryImage
                    publicId={resumeReading.sequence?.gridImageId || resumeReading.collection?.gridImageId || "sequences/vnyzzznenju0hzdv6pqb.jpg"}
                    height={48}
                    width={146}
                  />
                </NoSSR>
              </div>}
          </div>
          
          {<div className={classes.actions}>
            {dismissButton}
            {!resumeReading && <PostsPageActions post={post} vertical menuClassName={classes.actionsMenu} />}
          </div>}
          
          {renderComments && <div className={classes.newCommentsSection} onClick={() => this.toggleComments(true)}>
            <Components.PostsItemNewCommentsWrapper
              currentUser={currentUser}
              highlightDate={post.lastVisitedAt}
              terms={{view:"postCommentsUnread", limit:7, postId: post._id}}
              post={post}
              condensed={condensedAndHiddenComments}
              hideReadComments={condensedAndHiddenComments}
            />
          </div>}
        </div>
      </div>
    )
  }
}

PostsItem2.propTypes = {
  currentUser: PropTypes.object,
  post: PropTypes.object.isRequired,
};

registerComponent(
  'PostsItem2',
  PostsItem2,
  withStyles(styles, { name: "PostsItem2" }),
  withUser,
  withRecordPostView,
  withErrorBoundary,
);
