import React from 'react'
import styles from './OrderInfo.module.css';


function CommentBox() {
  return (
    <div className={styles.container}>
<h4 className={styles.commentHistory}>Comments History</h4>

    <div className={styles.commentbox} >

<div className={styles.CommentInner}>

        <div className={styles.BHousecomment}>
            <img src="/Svg/ChatBHouse.svg" alt="chat" />
            <div className={styles.BHousecommentMain}>
            <div className={styles.BHousecommentText}>
            <p className={styles.para}>Your order will reach Mumbai in 2 days.</p>
                       </div>
<p className= {styles.BTime}>13 MAR 12:57 PM</p>
                       </div>
        </div>

        <div className={styles.Usercomment}>
            <div className={styles.UsercommentMain}>
            <div className={styles.UsercommentText}>
            <p className={styles.Userpara}>Okay, that's fine. But when will I get the next update?</p>
                       </div>
<p className= {styles.UserBTime}>14 MAR 11:10 PM</p>
</div>  </div>

<div className={styles.BHousecomment}>
            <img src="/Svg/ChatBHouse.svg" alt="chat" />
            <div className={styles.BHousecommentMain}>
            <div className={styles.BHousecommentText}>
            <p className={styles.para}>Your order will reach Mumbai in 2 days.</p>
                       </div>
<p className= {styles.BTime}>13 MAR 12:57 PM</p>
                       </div>
        </div>

        <div className={styles.Usercomment}>
            <div className={styles.UsercommentMain}>
            <div className={styles.UsercommentText}>
            <p className={styles.Userpara}>Okay, that's fine. But when will I get the next update?</p>
                       </div>
<p className= {styles.UserBTime}>14 MAR 11:10 PM</p>
</div>  </div>
     

    </div>
    </div>

<div>
<textarea className={styles.Commenrtextarea} placeholder="Comment or (Leave your thought here)"></textarea>

<button className={styles.CommenrButton}>Comment Submit</button>

</div>


    </div>
  )
}

export default CommentBox