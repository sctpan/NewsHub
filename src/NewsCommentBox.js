import React from 'react'
import commentBox from "commentbox.io";

class NewsCommentBox extends React.Component {
    componentDidMount() {
        commentBox('5760240494575616-proj', { defaultBoxId: this.props.id });
    }

    componentWillUnmount() {
        commentBox('5760240494575616-proj', { defaultBoxId: this.props.id });
    }
    render() {
        return (
            <div className="commentbox" />
        );
    }
}
export default NewsCommentBox;