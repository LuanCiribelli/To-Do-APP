
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";


const Task = ({ task, toggleEdit, completeEditingTask }) => {

  const [localText, setLocalText] = useState(task.text);

  if (task.isEditing) {
    return (
      <View style={styles.item}>
        <TextInput
          value={localText}
          onChangeText={setLocalText}
          style={styles.editInput}
        />
        <TouchableOpacity onPress={() => {
          completeEditingTask(task.id, localText);
          toggleEdit(task.id);
        }}>
          <Text>[salvar]</Text>
        </TouchableOpacity>
      </View>
    )
  }
  else {
    return (
      <View style={styles.item}>
        <View style={styles.itemLeft}>
          <View style={styles.square}></View>
          <Text style={styles.itemText}>{task.text}</Text>
          <TouchableOpacity onPress={() => toggleEdit(task.id)}>
            <Text style={styles.editText}>🖊️</Text>  
          </TouchableOpacity>
        </View>
        <View style={styles.circular}></View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '80%',
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
  editText: {
    marginLeft: 10,
  },
  editInput: {
    flex: 1,
    backgroundColor: '#E8EAED',
    padding: 10,
    borderRadius: 5,
    marginRight: 10
  },

});



export default Task;