import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAssujetti, getUser } from '../app/reducers/assujetti';
import { useDispatch } from 'react-redux';
import { actions } from '../app/reducers/stockProduit';

/**
 * Connect the user to the socket
 * @param {*} socket Client socket
 * @param {string} module_name The name of the module
 */
function useConnectSocket(socket, module_name) {
    // get the assujetti object from redux
    const assujetti = useSelector(getAssujetti);
    const user = useSelector(getUser);
    const dispatch = useDispatch();

    useEffect(() => {
        if (assujetti && socket) {
            // connect the user
            socket.emit('connected', {
                room: assujetti.numero_def,
                userFonction: user.code_fonction,
                module: module_name
            });

            // New entrée get event
            socket.on('new_added_product', (data) => {
                console.log(data);
                if (data && data.message === "nouveau produit") {
                    dispatch(actions.appendProduit(data.data));
                }
            });

            // New entrée get event
            socket.on('new_entree', (data) => {
                console.log(data);
            });
        }

        return () => {
            socket.disconnect();
        }
    }, [assujetti, module_name, socket, user]);
}

/**
 * Sends the message
 * @param {*} socket Client Socket
 * @param {string} event The event name
 * @param {string|objet} message The message to send
 */
export function sendMessage(socket, event, message) {
    // Send he message
    socket.emit(event, message);
}


export default useConnectSocket;