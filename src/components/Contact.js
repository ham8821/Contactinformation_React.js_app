import React from 'react';
import ContactInfo from './ContactInfo';
import ContactDetails from './ContactDetails';
import ContactCreate from './ContactCreate';
import update from 'react-addons-update';

export default class Contact extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            selectedKey:- 1,
            keyword:'',
            contactData: [{
                name: 'Abet',
                phone: '010-0000-0001'
            }, {
                name: 'Betty',
                phone: '010-0000-0002'
            }, {
                name: 'Charlie',
                phone: '010-0000-0003'
            }, {
                name: 'David',
                phone: '010-0000-0004'
            }]
        };
       
        this.handleChange = this.handleChange.bind(this); 
        this.handleClick= this.handleClick.bind(this);
        this.handleCreate=this.handleCreate.bind(this);
        this.handleRemove=this.handleRemove.bind(this);
        this.handleEdit=this.handleEdit.bind(this);
    }
    
    componentWillMount(){
    // before rendering. This will be executed first.
        const contactData =localStorage.contactData;
        const nextId = localStorage.nextId;
        if(contactData){
            this.setState({
                contactData: JSON.parse(contactData),
                nextId
            })
        }
    }
    componentDidUpdate(prevProps, prevState){
    // This is executed everytime the components are updated. If the props and states are the same with previous version, it will save it and use it from localStorage.
        if(JSON.stringify(prevState.contactData) != JSON.stringify(this.state.contactData)){
            localStorage.contactData =JSON.stringify(this.state.contactData);
        }

        if(prevState.nextId !== this.state.nextId){
            localStorage.nextId = this.state.nextId;
        }
    }

    handleChange(e) {
        this.setState({
            keyword: e.target.value
        });
    }

    handleClick(key){
        this.setState({
            selectedKey: key
        })
        console.log(key,'is selected');
    }
    handleCreate(contact){
        this.setState({
            contactData: update(this.state.contactData,{$push:[contact]})
        });

    }
    handleRemove(){
        if(this.state.selectedKey<0){
            return;
        }
        this.setState({
            contactData: update(this.state.contactData,
                
                {$splice:[[this.state.selectedKey,1]]}
                ),
                selectedKey:-1
        });
    }
    handleEdit(name,phone){
        this.setState({
            contactData: update(this.state.contactData,
            {
                [this.state.selectedKey]: {
                    name: { $set: name},
                    phone: {$set: phone}
                }
            }
            )
        })
    }


    render() {
        const mapToComponents = (data) => {
            data.sort((a,b) => {
                return a.name < b.name ? -1 : 1;
                });
            data= data.filter(
                (contact)=>{
                    return contact.name.toLowerCase().indexOf(this.state.keyword) >-1;
                 }
                );
            return data.map((contact, i) => {
                return (<ContactInfo contact={contact}
                     key={i}
                     onClick={()=> this.handleClick(i)} />);
            });
        };
        
        return (
            <div className="numberbox">
                <h1>Contacts</h1>
                    <input className="searchinput"
                        name="keyword"
                        placeholder="Search"
                        value={this.state.keyword} onChange={this.handleChange}
                    >
                    </input>

                <div>{mapToComponents(this.state.contactData)}</div>
                <ContactDetails isSelected={this.state.selectedKey != -1}
                                contact={this.state.contactData[this.state.selectedKey]}
                                onRemove={this.handleRemove}//onRemove=> props
                                onEdit={this.handleEdit}
                />
                <ContactCreate 
                onCreate={this.handleCreate}
                />
            </div>
        );
    }
}

ContactDetails.defaultProps={
    contact:{
        name: '',
        phone: ''
    }
}
