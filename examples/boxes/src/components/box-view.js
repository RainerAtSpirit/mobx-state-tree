import React, {Component} from 'react';
import {observable, transaction, computed} from 'mobx';
import {observer} from 'mobx-react';
import {DraggableCore} from 'react-draggable';

@observer
class BoxView extends Component {
    render() {
        const {box} = this.props;
        return (
            <DraggableCore onDrag={this.handleDrag}>
                <div
                    style={{
                        width: box.width,
                        left: box.x,
                        top: box.y
                    }}
                    onClick={this.handleClick}
                    className={box.isSelected ? 'box box-selected' : 'box' }
                >
                    {box.name}
                </div>
            </DraggableCore>
        )
    }

    handleClick = (e) => {
        this.props.store.setSelection(this.props.box);
        e.stopPropagation();
    }

    handleDrag = (e, dragInfo) => {
        this.props.box.move(dragInfo.deltaX, dragInfo.deltaY);
    }
}

export default BoxView;
