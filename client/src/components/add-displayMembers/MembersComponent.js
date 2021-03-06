import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import API from "../../utils/API"
import DeleteButton from "../deleteMemberBtn/DeleteButton"
import { Card } from "react-bootstrap";
import "./style.css"


const MembersComponent = (props) => {

  // Use State and Hooks Setting //

  const { pathname } = useLocation();

  const [MemberString, setMember] = useState({
    name: "",
  })

  const [memberList, setMemberList] = useState([])

  useEffect(() => {
    retrieveMembers()
  }, [])

  const handleInputChange = (e) => {
    e.preventDefault()
    console.log(e.target.name);
    setMember({ ...MemberString, [e.target.name]: e.target.value })
  }

  // External JS functions //

  // Pushing Member Name to the MemberNames Array in Group Database //

  const addMember = (e) => {
    e.preventDefault();
    setMember({ ...MemberString, name: "" })
    const groupId = pathname.split("/")[1];
    API.addMembers(MemberString, groupId)
      .catch(err => console.log(err));
    retrieveMembers()
  }

  // Retrieving Members Data back from DB to display //

  const retrieveMembers = () => {
    const groupId = pathname.split("/")[1];
    API.findGroup2(groupId)
      .then((res => {
        let nameList = (res.data.user)
        setMemberList(nameList)
      }))
  }

  // Delete one member when they click on santa
  const deleteMember = (e) => {
    const memberId = e.target.dataset.id;
    const groupId = pathname.split("/")[1];
    API.deleteMember(groupId, memberId).then((res) => {
      retrieveMembers();
    })
  }

  // Visual Rendering //

  return (
    <div className="col-4">
      <Card
        style={{ width: "20rem" }}
        className="container-fluid group-card"
        id="group-card"
      >
        <Card.Body>
          <Card.Title>Members:</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
          </Card.Subtitle>
          <br></br>
          <form>

            {/* Name of Member  */}

            {memberList.map(member => (
              <>
                <h5>{member.name}
                  <DeleteButton name={member.name} id={member.id} deleteMember={deleteMember} /></h5>

              </>
            ))}

            <h5>Add Person:</h5>
            <input className="members-add-title" type="text" name="name" value={MemberString.name} onChange={handleInputChange} />

            <br></br>

            <button
              className="add-member-button btn btn-primary"
              onClick={addMember}>
              Submit
                </button>
          </form>
        </Card.Body>
      </Card>
    </div>

  )
}

export default MembersComponent;