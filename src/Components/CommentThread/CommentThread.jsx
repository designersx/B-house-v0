import React from 'react'
import styles from '../CommentThread/CommentThread.module.css'

const CommentThread = ({ issue }) => {
  const messages = [
    {
      sender: 'support',
      text: 'We can either repair it or replace it.',
      timestamp: '13 MAR 12:57 PM',
    },
    {
      sender: 'user',
      text: 'I prefer a replacement if possible.',
      timestamp: '14 MAR 11:10 AM',
    },
    {
      sender: 'support',
      text: 'If we have the same model available, we’ll replace it immediately.',
      timestamp: '16 MAR 10:12 PM',
    },
    {
      sender: 'user',
      text: 'Comfortable chair but chair broken right-side handle.',
      timestamp: '17 MAR 10:10 AM',
    },
  ]

  return (
    <div className={styles.threadContainer}>
      <div className={styles.header}>
        <p><b>{issue.title}– </b>{issue.description}</p>
      </div>

      <div className={styles.messages}>
        {messages.map((msg, index) => (
          msg.sender === 'support' ? (
            <div key={index} className={styles.supportMessageRow}>
              <img src="Svg/user-icon.svg" alt="avatar" className={styles.avatar} />
              <div>
                <div className={styles.messageBubbleSupport}>{msg.text}</div>
                <div className={styles.timestamp}>{msg.timestamp}</div>
              </div>
            </div>
          ) : (
            <div key={index} className={styles.userMessageRow}>
              <div>
                <div className={styles.messageBubbleUser}>{msg.text}</div>
                <div className={styles.timestamp2}>{msg.timestamp}</div>
              </div>
              <div style={{ width: 40, marginLeft: 8 }}></div>
            </div>
          )
        ))}
      </div>

      <div className={styles.commentBox}>
        <input
          type="text"
          placeholder="Comment or (Leave your thought here)"
          className={styles.inputField}
        />
        <button className={styles.commentButton}>COMMENT</button>
      </div>
    </div>
  )
}

export default CommentThread
