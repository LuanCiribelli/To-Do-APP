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

  // Função para salvar a edição da tarefa
  const handleSave = () => {
    if (localText !== task.text) {
      completeEditingTask(task.id, localText);
    }
    toggleEdit(task.id);
  };

  // Função para marcar a tarefa como concluída
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
        <Text>[Salvar]</Text>
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
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemText: {
    maxWidth: '80%',
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
