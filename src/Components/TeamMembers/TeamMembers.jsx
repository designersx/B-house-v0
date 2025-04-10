import React,{useState} from 'react'
import HeaderTab from '../../Components/HeaderTab/HeaderTab'
import styles from '../TeamMembers/TeamMembers.module.css'
import Modal from '../Modal/Modal'
const TeamMembers = () => {
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

    const contacts = [
        {
            name: "John Denni",
            role: "Administrator",
            phone: "(308) 555-0121",
            image: "Images/member1.png",
        },
        {
            name: "Lloyed",
            role: "Account Manager",
            phone: "+1 (555) 555-12345",
            image: "Images/member2.png",

        },
        {
            name: "Devon Lane",
            role: "Sr. Designer",
            phone: "(308) 555-0121",
            image: "Images/member3.png",
        },
        {
            name: "Darrell",
            role: "Operation Manager",
            phone: "(704) 555-0127",
            image: "Images/member4.png",
        },
        {
            name: "Henry",
            role: "Lead Installer",
            phone: "(505) 555-0125",
            image: "Images/member5.png",
        },
        {
            name: "Tome Duke",
            role: "Jr. Designer",
            phone: "(505) 555-0125",
            image: "Images/member6.png",
        },
    ];
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
  
    const handleSendMessage = (contact) => {
      setSelectedContact(contact);
      setModalOpen(true);
    };
    return (
        <div>
            <HeaderTab title='Team Members' />
            <div className={styles.contactList}>
        {contacts.map((contact, index) => (
          <div key={index} className={styles.contactCard}>
            <img src={contact.image} alt={contact.name} className={styles.avatar} />
            <div className={styles.info}>
              <div className={styles.name}>
                {contact.name} <span className={styles.role}>({contact.role})</span>
              </div>
              <div className={styles.phone}>{contact.phone}</div>
            </div>
            <div className={styles.buttons}>
              <button className={styles.callBtn}>Book a Call</button>
              <button
                className={styles.msgBtn}
                onClick={() => handleSendMessage(contact)}
              >
                Send Message
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal with custom content */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} height="80vh">
        <div>
            <div className={styles.header}>
            <p><b>Team Member -</b> {selectedContact?.name}</p>
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
      </Modal>
        </div>
    )
}

export default TeamMembers
