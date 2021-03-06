import * as mongoose from 'mongoose'

export interface Message extends mongoose.Document {
  user: string
  message: string
  createdAt: string
}

export interface Chat extends mongoose.Document {
  _id: string
  messages: Message[]
  users: string[]
}

const MessagesSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
})

const Schema = new mongoose.Schema(
  {
    messages: {
      type: [MessagesSchema],
      required: false,
      default: [],
    },
    users: {
      type: [String],
      required: true,
    },
    lastMessage: {
      type: String,
      required: false,
    },
    updatedAt: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'chat',
  },
)

export default mongoose.model<Chat>('Chat', Schema)
