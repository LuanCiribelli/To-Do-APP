import COLORS from "./colors";
import { StyleSheet, Dimensions } from 'react-native';


const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

const AppStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    highlightedText: {
        color: COLORS.accent,
    },
    taskWrapper: {
        flex: 1,
        paddingTop: 0.1 * windowHeight,
        paddingHorizontal: 0.05 * windowWidth,
        justifyContent: 'flex-start',
    },
    sectionTitle: {
        fontSize: 0.05 * windowWidth,
        fontWeight: 'bold',
        textAlign: 'center',
        color: COLORS.text,
    },
    items: {
        marginTop: 0.03 * windowHeight,
        paddingHorizontal: 0.05 * windowWidth,
    },
    writeTaskWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 0.05 * windowWidth,
        position: 'absolute',
        bottom: 0.08 * windowHeight,
        width: '100%',
    },
    input: {
        paddingVertical: 0.02 * windowHeight,
        width: '65%',
        backgroundColor: 'white',
        borderRadius: 30,
        borderColor: COLORS.secondary,
        borderWidth: 1,
        textAlign: 'center',
        paddingHorizontal: 15,
        fontSize: 16,
        color: COLORS.text,
    },
    addWrapper: {
        width: 0.15 * windowWidth,
        height: 0.15 * windowWidth,
        backgroundColor: COLORS.secondary,
        borderRadius: 0.075 * windowWidth,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#C0C0C0',
        borderWidth: 1,
        shadowColor: COLORS.shadowColor,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // for android

    },
    addText: {
        fontSize: 0.05 * windowWidth,
    },
    filtro: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        marginLeft: 10,
    }, 
    rowBack: {
        alignItems: 'center',
        backgroundColor: COLORS.background,  
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnRight: {
        backgroundColor:  COLORS.background,
        right: 0,
    },
    backTextWhite: {
        color: 'black',
    },
});
    
 

const TaskStyles = StyleSheet.create({
    item: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    itemText: {
        maxWidth: '80%',
        color: COLORS.text,
    },
    editText: {
        marginLeft: 10,
    },
    editInput: {
        flex: 1,
        backgroundColor: 'white',
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
        borderColor: COLORS.accent,
        marginRight: 15,
    },
    checkboxChecked: {
        width: 14,
        height: 14,
        backgroundColor: COLORS.accent,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    highlightedText: {
        color: COLORS.accent,
    },

});


export { AppStyles, TaskStyles };
