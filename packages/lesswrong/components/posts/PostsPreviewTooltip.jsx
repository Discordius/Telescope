import { registerComponent, Components, getSetting } from 'meteor/vulcan:core';
import React from 'react';
import { withStyles } from '@material-ui/core/styles'
import { truncate } from '../../lib/editor/ellipsize';
import withUser from "../common/withUser";
import { postHighlightStyles, commentBodyStyles } from '../../themes/stylePiping'
import { Posts } from '../../lib/collections/posts';
import Card from '@material-ui/core/Card';
import {AnalyticsContext} from "../../lib/analyticsEvents";
import { userHasBoldPostItems } from '../../lib/betas.js';

export const POST_PREVIEW_WIDTH = 330

const styles = theme => ({
  root: {
    width: POST_PREVIEW_WIDTH,
    position: "relative",
    padding: theme.spacing.unit*1.5,
    '& img': {
      maxHeight: "200px"
    },
    [theme.breakpoints.down('xs')]: {
      display: "none"
    },
  },
  title: {
    marginBottom: -6
  },
  tooltipInfo: {
    fontStyle: "italic",
    ...commentBodyStyles(theme),
    fontSize: "1.1rem",
    color: theme.palette.grey[600],
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  highlight: {
    ...postHighlightStyles(theme),
    marginTop: theme.spacing.unit*2.5,
    wordBreak: 'break-word',
    fontSize: "1.1rem",

    '& img': {
      display:"none"
    },
    '& h1': {
      fontSize: "1.2rem"
    },
    '& h2': {
      fontSize: "1.2rem"
    },
    '& h3': {
      fontSize: "1.1rem"
    },
    '& hr': {
      display: "none"
    }
  },
  commentIcon: {
    height: 15,
    width: 15,
    color: theme.palette.grey[400],
    position: "relative",
    top: 3,
    marginRight: 6,
    marginLeft: 12
  },
  comments: {
    [theme.breakpoints.up('sm')]: {
      float: "right"
    },
    [theme.breakpoints.down('xs')]: {
      display: "inline-block",
      marginRight: theme.spacing.unit*2,
    },
  },
  karma: {
    [theme.breakpoints.up('sm')]: {
      float: "right"
    },
    [theme.breakpoints.down('xs')]: {
      display: "inline-block",
      float: "left"
    },
  },
  comment: {
    marginTop: theme.spacing.unit*1.5,
    marginLeft: -13,
    marginRight: -13,
    marginBottom: -9
  },
  bookmarkButton: {
    float: "right"
  }
})

const metaName = getSetting('forumType') === 'EAForum' ? 'Community' : 'Meta'

const getPostCategory = (post) => {
  const categories = [];
  const postOrQuestion = post.question ? "Question" : "Post"

  if (post.isEvent) categories.push(`Event`)
  if (post.curatedDate) categories.push(`Curated ${postOrQuestion}`)
  if (post.af) categories.push(`AI Alignment Forum ${postOrQuestion}`);
  if (post.meta) categories.push(`${metaName} ${postOrQuestion}`)
  if (post.frontpageDate && !post.curatedDate && !post.af) categories.push(`Frontpage ${postOrQuestion}`)

  if (categories.length > 0)
    return categories.join(', ');
  else
    return post.question ? `Question` : `Personal Blogpost`
}

const PostsPreviewTooltip = ({ currentUser, showAllInfo, post, classes, truncateLimit=450, comment }) => {
  const { PostsUserAndCoauthors, PostsTitle, ContentItemBody, CommentsNode, BookmarkButton, PostsItemKarma } = Components

  if (!post) return null

  const { wordCount = 0, htmlHighlight = "" } = post.contents || {}

  const highlight = truncate(htmlHighlight, 100, "words")
  const renderCommentCount = showAllInfo && (Posts.getCommentCount(post) > 0)
  const renderWordCount = !comment && (wordCount > 0)

  return <AnalyticsContext pageElementContext="hoverPreview">
      <Card className={classes.root}>
        <div className={classes.title}>
          <PostsTitle post={post} tooltip={false} wrap showIcons={false} read={userHasBoldPostItems(currentUser)} />
        </div>
        <div className={classes.tooltipInfo}>
          { showAllInfo && post.user && <span><PostsUserAndCoauthors post={post} simple/></span>}
          { showAllInfo && <span><PostsItemKarma post={post} /> karma</span>}
          {/* { showAllInfo && <BookmarkButton post={post} />} */}
          {/* { renderCommentCount && <span className={classes.comments}>
            <CommentIcon className={classes.commentIcon}/>
              {Posts.getCommentCountStr(post)}
          </span>} */}
        </div>
        {comment
          ? <div className={classes.comment}>
              <CommentsNode
              truncated
              comment={comment}
              post={post}
              hoverPreview
              forceNotSingleLine
            /></div>
          : <ContentItemBody
              className={classes.highlight}
              dangerouslySetInnerHTML={{__html:highlight}}
              description={`post ${post._id}`}
            />
        }

        {/* {renderWordCount && <div className={classes.tooltipInfo}>
          <span>
            {wordCount} words ({Math.ceil(wordCount/300)} min read)
          </span>
        </div>} */}
    </Card>
  </AnalyticsContext>

}

registerComponent('PostsPreviewTooltip', PostsPreviewTooltip, withUser,
  withStyles(styles, { name: "PostsPreviewTooltip" })
);
