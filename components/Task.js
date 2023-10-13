import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated } from "react-native";
import { TaskStyles as styles } from './UI/AppStyles';


const Task = ({
  task,
  toggleEdit,
  completeEditingTask,
  toggleCheckbox,
  completeTaskItems
}) => {
  const [localText, setLocalText] = useState(task.text);

  // Função para salvar a edição da tarefa
  const handleSave = () => {
    if (localText !== task.text) {
      completeEditingTask(task.id, localText);
    }
    toggleEdit(task.id);
  };

  // Função para marcar/desmarcar a tarefa como concluída
  const handleCheckboxToggle = () => {
    toggleCheckbox(task.id);
  };
  const opacity = useState(new Animated.Value(0))[0];
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);


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
    <Animated.View style={{...styles.item, opacity}}>
      <Text style={styles.itemText}>{task.text}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => toggleEdit(task.id)}>
          <Text style={styles.editText}>🖊️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCheckboxToggle}>
          <View style={styles.checkboxBase}>
            {(task.checked || completeTaskItems.some(completedTask => completedTask.id === task.id)) && <View style={styles.checkboxChecked}></View>}
          </View>


        </TouchableOpacity>
      </View>
      </Animated.View>
  );
};



export default Task;
