import type { NotificationType } from 'oa-shared'
import { CONFIG } from '../config/config'
import { INotification } from '../models'
import {
  PP_PROJECT_IMAGE,
  PK_PROJECT_IMAGE,
  PP_PROJECT_NAME,
  PK_PROJECT_NAME,
} from './constants'
import { firebaseAuth } from '../Firebase/auth'

export const getUserEmail = async (uid: string): Promise<string | null> => {
  try {
    const { email } = await firebaseAuth.getUser(uid)
    return email
  } catch (error) {
    return null
  }
}

export const SITE_URL = CONFIG.deployment.site_url

export const getProjectImageSrc = () => {
  switch (SITE_URL) {
    case 'https://dev.onearmy.world':
    case 'https://community.preciousplastic.com':
      return PP_PROJECT_IMAGE
    case 'https://dev.community.projectkamp.com':
    case 'https://community.projectkamp.com':
      return PK_PROJECT_IMAGE
  }
}

export const getProjectName = () => {
  switch (SITE_URL) {
    case 'https://dev.onearmy.world':
    case 'https://community.preciousplastic.com':
      return PP_PROJECT_NAME
    case 'https://dev.community.projectkamp.com':
    case 'https://community.projectkamp.com':
      return PK_PROJECT_NAME
  }
}

export const getUserLink = (displayName: string, userName: string) =>
  `<a href='${SITE_URL}/u/${userName}'>${displayName}</a>`

const HOWTO_NOTIFICATIONS: NotificationType[] = [
  'new_comment',
  'howto_useful',
  'howto_mention',
  'howto_approved',
  'howto_needs_updates',
]
const RESEARCH_NOTIFICATIONS = [
  'new_comment_research',
  'research_useful',
  'research_mention',
  'research_update',
  'research_approved',
  'research_needs_updates',
]
const MAP_PIN_NOTIFICATIONS = ['map_pin_approved', 'map_pin_needs_updates']

const getResourceLabel = (type: NotificationType) => {
  if (HOWTO_NOTIFICATIONS.includes(type)) {
    return 'how-to'
  }
  if (RESEARCH_NOTIFICATIONS.includes(type)) {
    return 'research'
  }
  if (MAP_PIN_NOTIFICATIONS.includes(type)) {
    return 'map pin'
  }
  return 'item'
}

const getResourceLink = (
  notificationType: NotificationType,
  relevantUrl: string,
) =>
  `<a href='${SITE_URL}${relevantUrl}'>${getResourceLabel(
    notificationType,
  )}</a>`

const getCommentListItem = (notification: INotification) => `
<p>
    New comment on your ${getResourceLink(
      notification.type,
      notification.relevantUrl,
    )} by ${getUserLink(
  notification.triggeredBy.displayName,
  notification.triggeredBy.userId,
)}
</p>`

const getMentionListItem = (notification: INotification) => `
<p>
  ${getUserLink(
    notification.triggeredBy.displayName,
    notification.triggeredBy.userId,
  )} mentioned you in this ${getResourceLink(
  notification.type,
  notification.relevantUrl,
)}
</p>`

const getUsefulListItem = (notification: INotification) => `
<p>
    ${getUserLink(
      notification.triggeredBy.displayName,
      notification.triggeredBy.userId,
    )} found your ${getResourceLink(
  notification.type,
  notification.relevantUrl,
)}
useful
</p>
`

const getUpdateListItem = (notification: INotification) => `
<p>
    ${getUserLink(
      notification.triggeredBy.displayName,
      notification.triggeredBy.userId,
    )} posted an update to this ${getResourceLink(
  notification.type,
  notification.relevantUrl,
)}
you follow
</p>
`

const getModerationApprovedListItem = (notification: INotification) => `
<p>
    Your ${getResourceLink(
      notification.type,
      notification.relevantUrl,
    )} has been approved
</p>`

const getModerationRejectedListItem = (notification: INotification) => `
<p>
    Your ${getResourceLink(
      notification.type,
      notification.relevantUrl,
    )} needs updates
</p>`

const isCommentNotification = (notification: INotification) =>
  ['new_comment_research', 'new_comment'].includes(notification.type)

const isMentionNotification = (notification: INotification) =>
  ['research_mention', 'howto_mention'].includes(notification.type)

const isUsefulNotification = (notification: INotification) =>
  ['research_useful', 'howto_useful'].includes(notification.type)

const isUpdateNotification = (notification: INotification) =>
  notification.type === 'research_update'

const isModerationApprovedNotification = (notification: INotification) =>
  ['howto_approved', 'map_pin_approved', 'research_approved'].includes(
    notification.type,
  )

const isModerationRejectedNotification = (notification: INotification) =>
  [
    'howto_needs_updates',
    'map_pin_needs_updates',
    'research_needs_updates',
  ].includes(notification.type)

export const getNotificationListItem = (
  notification: INotification,
): string => {
  if (isCommentNotification(notification)) {
    return getCommentListItem(notification)
  }
  if (isMentionNotification(notification)) {
    return getMentionListItem(notification)
  }
  if (isUsefulNotification(notification)) {
    return getUsefulListItem(notification)
  }
  if (isUpdateNotification(notification)) {
    return getUpdateListItem(notification)
  }
  if (isModerationApprovedNotification(notification)) {
    return getModerationApprovedListItem(notification)
  }
  if (isModerationRejectedNotification(notification)) {
    return getModerationRejectedListItem(notification)
  }
}
