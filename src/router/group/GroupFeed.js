/**
 * 특정 그룹 피드
 * @Auth 해운 
 */

import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CreateFeedModal from './modals/CreateFeedModal';
import ReactHtmlParser from "react-html-parser";
import ModifyFeedModal from './modals/ModifyFeedModal';
import ModifyCmtModal from './modals/ModifyCmtModal';
import CareFeedModal from './modals/CareFeedModal';
import ModifyCareFeedModal from './modals/ModifyCareFeedModal';
import moment from 'moment';


export default function GroupFeed(){
    
    let params = useParams();
    let grpName = params.grpName;
    
    const userId = 'test2';

    const [grpCmtNo, setGrpCmtNo] = useState('');

    // 해당 그룹에 가입된 인원인지 확인
    const [member, setMember] = useState(false);

    const [groupFeed, setGroupFeed] = useState([]);
    const [careGroupFeed, setCareGroupFeed] = useState([]);
    const [groupLeader, setGroupLeader] = useState('');
    const [joinRequest, setJoinRequest] = useState([]);

    const [createFeedModal, setCreateFeedModal] = useState(false);
    const [modifyFeedModal, setModifyFeedModal] = useState(false);
    const [modifyCmtModal, setModifyCmtModal] = useState(false);
    const [careFeedModal, setCareFeedModal] = useState(false);
    const [modifyCareFeedModal, setModifyCareFeedModal] = useState(false);

    const [selectedGrpFeedId, setSelectedGrpFeedId] = useState('');

    // 특정 그룹의 리더를 가져오는 함수
    const getGroupLeader = async () => {
        axios.get("http://localhost:3000/group/getGroupLeader", {params:{"grpNo":params.grpNo}})
        .then(function(res) {
            setGroupLeader(res.data);
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 특정 그룹에 가입 요청한 회원을 가져오는 함수
    const getGroupJoinRequest = async () => {
        axios.get("http://localhost:3000/group/getGroupJoinRequest", {params:{"grpNo":params.grpNo}})
        .then(function(res) {
            setJoinRequest(res.data.joinRequestList);
        })
        .catch(function(err) {
            alert(err);
        })
    }

    useEffect(()=>{
        if(params.grpName === "돌봄") {
            getCareGroupAllFeed();
        }
        isMember();
        getGroupLeader();
        getGroupJoinRequest();
    },[params.grpNo])


    // 해당 그룹 가입 여부에 따른, 피드 출력 방식 
    const isMember = async () => {
        axios.post("http://localhost:3000/group/isMember", null, {params:{"groupId":params.grpNo, "memberId":userId}})
        .then(function(res) {
            if(res.data.count !== 0) {
                setMember(true);
                setGroupFeed(res.data.groupAllFeed);
            } else {
                setGroupFeed(res.data.groupFeed);
            }
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 돌봄 그룹 피드 출력
    const getCareGroupAllFeed = async () => {
        axios.get("http://localhost:3000/group/getCareGroupAllFeed", {params:{"grpNo":params.grpNo}})
        .then(function(res){
            setCareGroupFeed(res.data.careGroupFeedList);
            console.log(res.data.careGroupFeedList);
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 댓글 리스트 커스텀 훅
    const useCommentList = (grpFeedNo) => {
        const [commentList, setCommentList] = useState([]);

        useEffect(()=>{
            axios.get("http://localhost:3000/group/getCommentList", {params:{"grpFeedNo":grpFeedNo}})
            .then(function(res){
                setCommentList(res.data.cmtList);
            })
            .catch(function(err){
                alert(err);
            })
        }, [grpFeedNo]);

        return commentList;
    }

    // 특정 인원의 그룹 가입 요청 승인 함수
    const acceptJoinRequest = async (memberId) => {
        axios.post("http://localhost:3000/group/acceptJoinRequest", null, {params:{"groupId":params.grpNo, "memberId": memberId}})
        .then(function(res) {
            alert(res.data);
            window.location.reload();
        })
        .catch(function(err){
            alert(err);
        })
    }


    // 피드 삭제
    const feedDelete = async (grpFeedNo) => {
        if(window.confirm("피드를 삭제하시겠습니까?")) {
            axios.get("http://localhost:3000/group/feedDelete", {params:{"grpFeedNo":grpFeedNo}})
            .then(function(res){
                alert(res.data);
                window.location.reload();
            })
            .catch(function(err){
                alert(err);
            })
        }
    }

    // 좋아요 처리
    const likeHandler = async (feedNo) => {
        axios.post("http://localhost:3000/group/groupFeedLike", null, {params:{"grpFeedNo":feedNo, "grpFeedLikeId":userId}})
        .then(function(res) {
            alert(res.data);
            window.location.reload();
        })
        .catch(function(err){
            alert(err);
        })
    }

    {/*일반 그룹 피드 및 해당 피드 댓글 출력 component*/}
    const FeedWithComments = ((props)=>{
        const commentList = useCommentList(props.feed.grpFeedNo);

        const [count, setCount] = useState('');
        const [comment, setComment]= useState('');
        

        // 댓글 카운트
        axios.get("http://localhost:3000/group/getCommentList", {params:{"grpFeedNo":props.feed.grpFeedNo}})
        .then(function(res){
            setCount(res.data.cmtCount);
        })
        .catch(function(err){
            alert(err);
        })

        // 댓글 등록 처리 함수
        const cmtSubmit = async(grpFeedNo) => {
            axios.post("http://localhost:3000/group/writeGrpFeedCmt", null, {params:{"grpFeedNo":grpFeedNo, "grpFeedCmtId":userId, "grpFeedCmtContent":comment}})
            .then(function(res){
                alert(res.data);
                window.location.reload();
            })
            .catch(function(err){
                alert(err);
            })
        }

        // 댓글 삭제 처리 함수
        const cmtDelete = async(grpCmtNo) => {
            if(window.confirm("댓글을 삭제하시겠습니까?")) {
                axios.get("http://localhost:3000/group/cmtDelete", {params:{"grpCmtNo":grpCmtNo}})
                .then(function(res){
                    alert(res.data);
                    window.location.reload();
                })
                .catch(function(err){
                    alert(err);
                })
            };
        }

        return (
            <>
                <tr>
                    <td>{props.feed.grpFeedId}</td>
                    <td>{ReactHtmlParser(props.feed.grpFeedContent)}</td>
                    <td>{props.feed.grpFeedWd.substring(0,10)}</td>
                    <td>{props.feed.grpFeedSetting}</td>
                    {userId === props.feed.grpFeedId && (
                        <>
                        <td>
                            <button
                                onClick={()=>{
                                    setModifyFeedModal(true);
                                    setSelectedGrpFeedId(props.feed.grpFeedNo);
                                }}
                            >
                            수정
                            </button>
                            &nbsp;
                            <button
                                onClick={()=>{
                                    feedDelete(props.feed.grpFeedNo)
                                }}>
                            삭제
                            </button>
                        </td>
                        </>
                    )}
                </tr>
                <tr>
                    <th colSpan={2}>
                        <img src="/like.png"
                            alt="like"
                            style={{width:"30px", height:"30px"}}
                            onClick={()=>{likeHandler(props.feed.grpFeedNo)}}
                        />
                            {props.feed.grpFeedLikeCount}명이 좋아합니다.
                    </th>
                </tr>
                <tr>
                    <td colSpan="3">
                        <textarea 
                            cols="100"
                            rows="2"
                            value={comment}
                            placeholder="소중한 댓글을 남겨주세요"
                            onChange={(e)=>{setComment(e.target.value);}}
                        />
                    </td>
                    <td><button type="button" onClick={()=>{cmtSubmit(props.feed.grpFeedNo)}}>등록</button></td>
                </tr>
                <tr>
                    <th>댓글({count})</th>
                </tr>
                {commentList.map((cmt) => (
                    <>
                    <tr key={cmt.grpCmtNo}>
                        <th>{cmt.grpFeedCmtId}</th>
                        <td>{cmt.grpFeedCmtWd.substring(0,10)}</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{cmt.grpFeedCmtContent}</td>
                        <td><button onClick={()=>{
                                                                    const handleClick = () => {
                                                                        setModifyCmtModal(true);
                                                                        setGrpCmtNo(cmt.grpCmtNo);
                                                                    };
                                                                   return handleClick();
                                                                }}>수정</button></td>
                        <td><button onClick={()=>{cmtDelete(cmt.grpCmtNo)}}>삭제</button></td>
                    </tr>
                    <tr>
                        <td colSpan={5}>───────────────────────────────────────</td>
                    </tr>
                    </>
                ))}
            </>
        ) // end of return
    }) // end of FeedWithComments
    
    return (
        <>
        <h1>{grpName}</h1>
        <CreateFeedModal show={createFeedModal}
                                            onHide={()=>{setCreateFeedModal(false)}} />
        <ModifyFeedModal show={modifyFeedModal}
                                            onHide={()=>{setModifyFeedModal(false)}}
                                            grpFeedNo={selectedGrpFeedId} />
        <ModifyCmtModal show={modifyCmtModal}
                                            onHide={()=>{setModifyCmtModal(false)}}
                                            grpCmtNo={grpCmtNo}/>
        <CareFeedModal show={careFeedModal}
                                            onHide={()=>{setCareFeedModal(false)}}
                                            />
        <ModifyCareFeedModal show={modifyCareFeedModal}
                                            onHide={()=>{setModifyCareFeedModal(false)}}
                                            grpFeedNo={selectedGrpFeedId}
                                            />

        {member === true && (
        <input
            readOnly
            style={{border:'none'}}
            className="my-3 py-3"
            type="text"
            size="50"
            onClick={()=>{grpName === '돌봄' ? setCareFeedModal(true) : setCreateFeedModal(true)}}
            placeholder={grpName === '돌봄' ? '돌봄이 필요하세요?' : '무슨 일이 일어나고 있나요?'}
        />
        )}
        {grpName !== '돌봄' ? <NormalGroup /> : <CareGroup />}
         {userId === groupLeader
        ?
            <div>
            {
            joinRequest !== null && joinRequest.length !== 0
            ?
                <>
                <p>{groupLeader}님, 새로운 그룹 가입 요청을 확인해보세요!</p>
                <table border="1">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>승인여부</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        joinRequest.map(function(list, i){
                            return(
                                <tr key={i}>
                                    <td>{list.memberId}</td>
                                    <td><button type="button" onClick={()=>{acceptJoinRequest(list.memberId)}} >가입 승인</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                </>
            :
            <p></p>
             }
            </div>
        :
        <p></p>
        }
       </>
    );

    function NormalGroup() {
        return (
            <>
            {groupFeed !== null && groupFeed.length !== 0
            ?
                    <table text-align="center">
                        <colgroup>
                            <col width='70' /><col width='600' /><col width='100' /><col width='70' />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>작성자</th>
                                <th>피드 내용</th>
                                <th>작성일</th>
                                <th>공개여부</th>
                                <th>수정/삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupFeed.map((feed, i) => (
                                <>
                                <FeedWithComments
                                    key={i}
                                    feed={feed}
                                />
                                <tr>
                                    <td colSpan={5}>──────────────────────────────────────────────────────────────────────</td>
                                </tr>
                                </>
                            ))}
                        </tbody>
                    </table>
            :
            <>
            <p>해당 그룹에 작성된 피드가 없습니다.</p>
            </>
            }
            </>
        )
    }

    function CareGroup(){

        // 피드 삭제
        const deleteCareFeed = async (i) => {
            await axios.get("http://localhost:3000/group/deleteCareFeed", {params:{"careGrpFeedNo":i}})
            .then(function(res){
                alert(res.data);
                window.location.reload();
            })
            .catch(function(err){
                alert(err);
            })
        }

        return (
            <>
             {careGroupFeed !== null && careGroupFeed.length !== 0
            ?
                    <table text-align="center">
                        <colgroup>
                            <col width='70' /><col width='200' /><col width='100' /><col width='200' /><col width='200' />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>분류</th>
                                <th>피드 내용</th>
                                <th>작성자</th>
                                <th>시작일</th>
                                <th>종료일</th>
                                <th>시작시간</th>
                                <th>종료시간</th>
                                <th>체크사항</th>
                                <th>작성일</th>
                                <th>공개여부</th>
                                <th>수정/삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {careGroupFeed.map(function(feed,i){
                                return(
                                    <>
                                    <tr key={i}>
                                        {feed.careGrpType === 'care' ? <td>돌봄</td> : <td>산책</td> }
                                        <td>{ReactHtmlParser(feed.careGrpContent)}</td>
                                        <td>{feed.careGrpFeedWriter}</td>
                                        <td>{moment(feed.careGrpStartDt).locale("ko").format("YY년 MM월 DD일")}</td>
                                        <td>{moment(feed.careGrpEndDt).locale("ko").format("YY년 MM월 DD일")}</td>
                                        <td>{moment(feed.careGrpStartTime).format("HH:mm")}</td>
                                        <td>{moment(feed.careGrpEndTime).format("HH:mm")}</td>
                                        <td>{feed.careGrpCheck}</td>
                                        <td>{feed.careGrpFeedWd.substring(0,10)}</td>
                                        <td>{feed.careGrpFeedSetting}</td>
                                        <td>
                                            <button
                                                onClick={()=>{
                                                    setModifyCareFeedModal(true);
                                                    setSelectedGrpFeedId(feed.careGrpFeedNo);
                                                }}>수정
                                            </button>
                                            <button onClick={()=>{deleteCareFeed(feed.careGrpFeedNo)}}>삭제</button>
                                        </td>
                                    </tr>
                                    </>
                                )
                            })}
                        </tbody>
                    </table>
            :
            <>
            <p>해당 그룹에 작성된 피드가 없습니다.</p>
            </>
            }
            </>
        )
    }
}