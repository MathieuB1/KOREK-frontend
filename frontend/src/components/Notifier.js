import React from 'react';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const mapStateToProps = state => ({ ...state.websocket });

class Notifier extends React.Component {

    componentDidUpdate(prevProps) {
        // get websocket message
        if (this.props.message && this.props.message !== prevProps.message) {
            if (this.props.message.split(';').length > 1) {
                toast.info(this.props.message.split(';')[1]);
            }
        }
    }

    render() {
        return (<div>
                    <ToastContainer
                        position="bottom-right"
                        autoClose={1000}
                        hideProgressBar={true}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        />
                </div>);
    }


}




export default connect(mapStateToProps)(Notifier);