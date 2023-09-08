import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";

const Task = ({
  task,
  toggleEdit,
  completeEditingTask,
  toggleCheckbox,
  completeTaskById
}) => {
  const [localText, setLocalText] = useState(task.text);

  const handleSave = () => {
    completeEditingTask(task.id, localText);
    toggleEdit(task.id);
  };

  const handleCheckboxToggle = () => {
    toggleCheckbox(task.id);
    setTimeout(() => {
      completeTaskById(task.id);
    }, 500);
  };

  return task.isEditing ? (
    <View style={styles.item}>
      <TextInput
        value={localText}
        onChangeText={setLocalText}
        style={styles.editInput}
      />
      <TouchableOpacity onPress={handleSave}>
        <Text>[salvar]</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.item}>
      <Text style={styles.itemText}>{task.text}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => toggleEdit(task.id)}>
          <Text style={styles.editText}>🖊️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCheckboxToggle}>
          <View style={styles.checkboxBase}>
            {task.checked && <View style={styles.checkboxChecked}></View>}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',  // Isso irá separar o texto e a View das ações
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
  checkboxBase: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#55BCF6',
    marginRight: 15,
  },
  checkboxChecked: {
    width: 14,
    height: 14,
    backgroundColor: '#55BCF6',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  }

});



export default Task;