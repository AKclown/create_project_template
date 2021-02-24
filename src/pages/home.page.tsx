import React from 'react';
import snackbar from '../components/snackbar';
import './scss/home.page.scss';

class HomePage extends React.Component<Props, State> {

    // *********************
    // Default Function
    // *********************

    // *********************
    // Life Cycle Function
    // *********************
    componentDidMount(){
        snackbar.success('消息条')
    }
    // *********************
    // Service Function
    // *********************

    // *********************
    // View
    // *********************

    render() {
        return (
            <div className='homePage'>

            </div>
        )
    }
}
export default HomePage;

// *********************
// Props & State
// *********************

type Props = {}

type State = {}