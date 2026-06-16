import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";

export interface ChatMessage {
  _id: string | number;
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    name?: string;
  };
  quickReplies?: {
    type: string;
    values: Array<{
      title: string;
      value: string;
    }>;
  };
}

interface SimpleChatUIProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  onQuickReply: (reply: { title: string; value: string }) => void;
  placeholder?: string;
  currentUserId: number;
}

export default function SimpleChatUI({
  messages,
  onSend,
  onQuickReply,
  placeholder = "Digite uma mensagem...",
  currentUserId,
}: SimpleChatUIProps) {
  const [inputText, setInputText] = React.useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSend(inputText.trim());
      setInputText("");
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.user._id === currentUserId;

    return (
      <View
        key={message._id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.botMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.botBubble,
          ]}
        >
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {message.text}
          </Text>
        </View>

        {message.quickReplies && (
          <View style={styles.quickRepliesContainer}>
            {message.quickReplies.values.map((reply, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickReplyButton}
                onPress={() => onQuickReply(reply)}
                activeOpacity={0.7}
              >
                <Text style={styles.quickReplyText}>{reply.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {[...messages].reverse().map(renderMessage)}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={placeholder}
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() ? Colors.teal : Colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  botMessageContainer: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: "100%",
  },
  userBubble: {
    backgroundColor: Colors.teal,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: Colors.bgCard,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  userMessageText: {
    color: Colors.white,
  },
  quickRepliesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 8,
  },
  quickReplyButton: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.teal,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quickReplyText: {
    color: Colors.teal,
    fontSize: 14,
    fontWeight: "600",
  },
  inputContainer: {
    backgroundColor: Colors.bgSecondary,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: Colors.bgCard,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.bgTertiary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
