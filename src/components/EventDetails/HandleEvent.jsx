/*************************************
 ***  Made By Yohay Hackam         ***
 ***  mail: Yoman_321@hotmail.com  ***
 ***  054-2616626                  ***
 *************************************/

import { useEffect,  useContext } from 'react'
import { MyContext } from '../../services/MyProvider';
import MyNotification from '../../services/MyNotification';
import FatchDataApi from '../../services/FatchDataApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'


export default function HandleEvent({ focusedEvent, setInvoke, initialValue, eventHandle, setEventHandle, eventsToHandle }) {

    //Pull data from Main Screen
    const { accessToken, setFocusedEvent,
        handleTypes, setHandleTypes,
        handleUsers, setHandleUsers,
        allowedClose, setAllowedClose,
        eventsArr, setEventsArr } = useContext(MyContext);


    // ***************************************************************
    //          Initialise handleTypes , handleUsers & allowedClose Lists
    // ***************************************************************
    useEffect(() => {
        if (!handleTypes) FatchDataApi('handling_types', 'GET', accessToken, setHandleTypes)
        if (!handleUsers) FatchDataApi('handling_users', 'GET', accessToken, setHandleUsers)
        if (!allowedClose) FatchDataApi('allowed', 'GET', accessToken, setAllowedClose)
    }, [])

    //Update handle Obj onChange Focused Event Type 
    useEffect(() => {
        //Prevent Authoriser Close  when change event type other then 'Flow'
        if (focusedEvent?.event_id !== 1)
            setEventHandle(prev => { return { ...prev, authoriser: "", customAuthoriser: "", notes: prev.notes } })
        //Prevent Manually Close when change event type to 'Battary' or 'life-signal'
        if ([5, 6].includes(focusedEvent?.trigger_id) && eventHandle.selectedHandle === "-1")
            setEventHandle(prev => { return { ...prev, selectedHandle: "", notes: prev.notes } })
    }, [focusedEvent?.trigger_id])



    // ***************************************************************
    //                  Updating User Handling choices 
    //                  Locally and POST to Server
    // ***************************************************************

    const updateHandleEvent = (status) => {
        postHandleToServer({ ...eventHandle, event_status: status, events: eventsToHandle });
        setFocusedEvent();
        setEventHandle(initialValue);

    }


    // ****************************************************
    //                  Post Handle To Server
    // ****************************************************

    function postHandleToServer(Handle) {

        const updateEvents = (responseData) => {
            setInvoke((old) => old + 1);
            setEventsArr([...eventsArr.map(event => { const updatedEvent = responseData.success_list.findIndex(response => response.event.event_id === event.event_id); return (updatedEvent !== -1) ? responseData.success_list[updatedEvent].event : event })]);
            // setEventsArr([...eventsArr.map(event => (event.event_id !== responseData.Event.event_id)?event : responseData.Event) ]);
            if (responseData.failure_list)
                if (responseData.failure_list.length === 1)
                    MyNotification("red", `?????????? ???????????? ?????????? ????????????`, `?????????? ?????????? ???????????? ${responseData.failure_list[0].event.event_id} ????????`);
                else
                    MyNotification("red", `?????????? ???????????? ?????????? ????????????????`, `?????????? ${responseData.failure_list.length} ????????????  ??????????????: ${responseData.failure_list.map(failure => failure.event.event_id)} ????????`);
            if (responseData.success_list)
                if (responseData.success_list.length === 1)
                    MyNotification("light", `?????????? ????????????`, `?????????? ???????????? ${responseData.success_list[0].event.event_id} ???????? ????????????`);
                else
                    MyNotification("light", `?????????? ????????????????`, `?????????? ?? ${responseData.success_list.length} ?????????????? : ${responseData.success_list.map(success => success.event.event_id)} ???????? ????????????`);

        }
        FatchDataApi('event_handle', 'POST', accessToken, updateEvents, { payload: Handle, errorMsgTitle: "?????????? ???????????? ??????????", successCodes: [201, 207, 409] })

    }


    return (
        <table>
            <thead>
                <tr>
                    <td>
                        {(eventHandle?.authoriser || eventHandle?.selectedHandle === '-1') ?
                            <h4>?????????? ????????????</h4> :
                            <h4>?????????? ??????????</h4>}


                    </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="EventHandle" onSubmit={updateHandleEvent} >
                        <div className="HandleGrid">
                            {(focusedEvent?.trigger_id === 1) && //???? ?????????? ?????????? ?????? ???????????? ?????????? ???????? ??????????
                                <>
                                    <label htmlFor="selectedauthoriser" className="detailsMiniLable">????????&nbsp;??????????&nbsp;:</label>
                                    <select name='selectedauthoriser'
                                        id='selectedauthoriser'
                                        value={eventHandle?.authoriser}
                                        onChange={(e) => setEventHandle(prev => {
                                            return { ...initialValue, notes: prev.notes, authoriser: e.target.value }
                                        })} >
                                        <option value="" >?????? ???????? ??????????</option>

                                        {allowedClose?.map((allowed, idx) => {
                                            return <option key={idx} value={allowed.name}>{allowed.name}</option>
                                        })}

                                        <option value="Custom">??????</option>
                                    </select>
                                </>
                            }
                            {
                                (eventHandle?.authoriser === "Custom") ? //???? ?????????? ?????? ???????????? ???????? ???????????? ?????????? 
                                    <>
                                        <label htmlFor="customAuthoriser" className="detailsMiniLable">????&nbsp;??????????&nbsp;:</label>
                                        <input name="customAuthoriser"
                                            id="customAuthoriser"
                                            type="text"
                                            required
                                            value={eventHandle?.customAuthoriser}
                                            onChange={e => setEventHandle(prev => { return { ...prev, customAuthoriser: e.target.value } })}
                                            placeholder="???????? ??????????" />
                                    </> : <></>
                            }

                            {(focusedEvent?.trigger_id !== 1 || eventHandle?.authoriser === "") ? //???? ???? ?????????? ?????? ???? ???? ?????????? ???????????? ???????? ??????????
                                <>
                                    <label htmlFor="selectEventHandle" className="detailsMiniLable">????????&nbsp;????????????&nbsp;:</label>
                                    <select name='selectEventHandle'
                                        id='selectEventHandle'
                                        required
                                        value={eventHandle?.selectedHandle}
                                        onChange={(e) => setEventHandle(prev => { return { ...initialValue, notes: prev.notes, selectedHandle: e.target.value } })} >
                                        <option value="" defaultChecked disabled>?????? ?????????? ????????????</option>

                                        {handleTypes?.map((handleType, idx) => {
                                            return <option key={idx} value={handleType.type_id}>{handleType.name}</option>
                                        })}
                                        {(![5, 6].includes(focusedEvent.trigger_id)) && <option value="-1" >?????????? ??????????</option>}

                                    </select>
                                </>

                                : <></>}
                            {(eventHandle?.selectedHandle && eventHandle.selectedHandle !== '-1' && (focusedEvent?.trigger_id !== 1 || eventHandle?.authoriser === "")) ? //???? ???????? ?????????? ????????
                                <>
                                    <label htmlFor="selectHandleUser" className="detailsMiniLable" >????????&nbsp;????????????&nbsp;:</label>
                                    <select name='selectHandleUser'
                                        id='selectHandleUser'
                                        required
                                        value={eventHandle?.selectedHandlerUser}
                                        onChange={(e) => setEventHandle(prev => { return { ...prev, selectedHandlerUser: e.target.value } })} >
                                        <option value="" disabled>??????</option>
                                        {
                                            handleUsers ?
                                                handleUsers.filter(user => user.handling_type_id === Number(eventHandle.selectedHandle)).length ?
                                                    handleUsers.filter(user => user.handling_type_id === Number(eventHandle.selectedHandle)).map((handleUser, idx) => {
                                                        return <option key={idx} value={handleUser.user_id}>{handleUser.first_name}&nbsp;{handleUser.last_name}</option>
                                                    }) : <option value="" defaultChecked disabled>???? ???????? ???????? ????????</option>
                                                : <></>

                                        }

                                    </select>

                                    <label className="detailsMiniLable">??????????&nbsp;??????????&nbsp;:</label>
                                    <div className="checkbox-area">
                                        {/* <label htmlFor="sms" className="detailsMiniLable" >
                                <input type="checkbox" id="sms" name="sms" 
                                checked={eventHandle.sms} 
                                onChange={(e) => setEventHandle({ ...eventHandle, sms: e.target.checked })} />??????????
                            </label> */}
                                        <label htmlFor="mail" className="detailsMiniLable" >
                                            <input type="checkbox" id="mail" name="mail"
                                                checked={eventHandle?.mail}
                                                onChange={(e) => setEventHandle(prev => { return { ...prev, mail: e.target.checked } })} />????????
                                        </label>
                                    </div>

                                </>
                                : <></>
                            }
                            {/* **************** * ???????? ?????????? ********************** */}
                            <label htmlFor="notes" className="detailsMiniLable" >??????????&nbsp;:</label>

                            <textarea id="notes" name="notes" cols="5" rows="2"
                                value={eventHandle?.notes}
                                placeholder='?????????? ????????????'
                                onChange={(e) => setEventHandle(prev => { return { ...prev, notes: e.target.value } })}></textarea>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td className="btnContainer btnEnd" >
                        {//?????????? ??????????\?????????? ?????????? ???????????? ???? ????????????
                            (eventHandle?.authoriser || eventHandle?.selectedHandle === '-1') ?
                                <button
                                    onClick={() => { updateHandleEvent(2) }}
                                    className="btn"
                                    disabled={(eventHandle.authoriser === "Custom" && eventHandle.customAuthoriser === "") ? true : false}>??????????&nbsp;????????????&nbsp;
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button> :
                                <button
                                    onClick={() => { updateHandleEvent(1) }}
                                    className="btn"
                                    disabled={(eventHandle?.selectedHandle && eventHandle?.selectedHandlerUser) ? false : true}>??????????&nbsp;??????????&nbsp;
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                        }
                    </td>
                </tr>
            </tfoot>
        </table>
    )
}
