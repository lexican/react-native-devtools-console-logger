/**
 * Dev Tools Main Component
 * Provides a floating button and overlay with Console and Context Inspector
 */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import { ConsoleLogger } from "./ConsoleLogger";
import { ConsoleUI } from "./ConsoleUI";

export function ConsoleDevTools() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Debug: Log when component mounts (not during render)
    console.log("ConsoleDevTools component mounted");
    console.log("ConsoleDevTools useEffect starting...");
    
    // Start console logging when component mounts
    try {
      ConsoleLogger.start();
      console.log("Console Dev Tools Initialized - Logger started successfully");
    } catch (error) {
      console.error("Failed to start ConsoleLogger:", error);
    }

    return () => {
      console.log("ConsoleDevTools useEffect cleanup - stopping logger");
      // Stop console logging when component unmounts
      ConsoleLogger.stop();
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleToggle}
          activeOpacity={0.8}
        >
          <Text style={styles.fabText}>🔧</Text>
        </TouchableOpacity>
      )}

      {/* Dev Tools Modal */}
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={false}
        onRequestClose={handleClose}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Dev Tools</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <ConsoleUI />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4fc3f7",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
  },
  fabText: {
    fontSize: 24,
  },
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    paddingTop: Platform.OS === "ios" ? 44 : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#2a2a2a",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
});
