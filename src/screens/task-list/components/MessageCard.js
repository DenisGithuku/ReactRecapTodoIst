export const MessageCard = ({userMessage, messageType, messageCardStatus}) => {
    return (
        <div className={`message-card ${messageType} ${messageCardStatus}`}>
          <span>{userMessage.message}</span>
        </div>
    )
}