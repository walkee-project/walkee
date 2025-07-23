import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import RouteCard from "./RouteCard";
import FollowCard from "./FollowCard";
import "./css/courseList.css";
import arrow_back from "../assets/arrow_back.png";
import type {
  course_section_type,
  Follow,
  RouteItem,
} from "./types/courseList_type";
import { fetchUserSummaryThunk } from "../store/userSlice";

async function deleteRouteApi(routeIdx: number) {
  const res = await fetch(`${__API_URL__}/routes/${routeIdx}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("경로 삭제 실패");
}

const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const summary = useAppSelector((state) => state.user.summary);
  const dispatch = useAppDispatch();
  const userIdx = useAppSelector((state) => state.user.user?.userIdx);
console.log(summary?.userFollows);
  // sectionType은 location.state에서만 fallback (찜한 경로 등)
  const sectionType: course_section_type =
    location.state?.sectionType ?? "mycourse";

  // 내 경로 페이지에서만 탭 사용
  const [activeTab, setActiveTab] = useState<"mycourse" | "myruns">("mycourse");

  let listData: (RouteItem | Follow)[] = [];
  let title = "";
  if (sectionType === "mycourse") {
    if (activeTab === "mycourse") {
      listData = summary?.userRoute ?? [];
      title = "내 경로";
    } else {
      listData = summary?.userFollows ?? [];
      title = "러닝 기록";
    }
  } else if (sectionType === "wishlist") {
    listData = summary?.userRouteLike ?? [];
    title = "찜한 경로";
  }

  const handleBack = () => {
    const from = location.state?.from;
    if (from === "map") {
      navigate("/map", {
        state: {
          tab: "course",
        },
      });
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      // 기본 경로를 명시적으로 지정 (예: 마이페이지)
      navigate("/mypage");
    }
  };

  // 경로 삭제 핸들러
  const handleDeleteRoute = async (routeIdx: number) => {
    if (!window.confirm("정말로 이 경로를 삭제하시겠습니까?")) return;
    try {
      await deleteRouteApi(routeIdx);
      if (userIdx) {
        await dispatch(fetchUserSummaryThunk(userIdx));
      }
      alert("경로가 삭제되었습니다.");
    } catch (err) {
      alert("경로 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="courseList">
      <div className="courseList_section">
        <button className="back_btn" onClick={handleBack}>
          <img src={arrow_back} alt="back_arrow" />
        </button>

        <div className="course-header">
          <p>{title}</p>
        </div>

        {/* 내 경로 페이지에서만 탭 노출 */}
        {sectionType === "mycourse" && (
          <div className="course-tabs">
            <button
              className={activeTab === "mycourse" ? "tab active" : "tab"}
              onClick={() => setActiveTab("mycourse")}
            >
              내 경로
            </button>
            <button
              className={activeTab === "myruns" ? "tab active" : "tab"}
              onClick={() => setActiveTab("myruns")}
            >
              러닝 기록
            </button>
          </div>
        )}

        <div className="course-list">
          {listData.length > 0 ? (
            listData.map((item) => {
              if (sectionType === "mycourse" && activeTab === "myruns") {
                return <FollowCard key={(item as Follow).followIdx} follow={item as Follow} />;
              }
              if (sectionType === "mycourse" && activeTab === "mycourse") {
                return (
                  <div
                    key={(item as RouteItem).routeIdx}
                    onClick={() =>
                      navigate("/map", {
                        state: {
                          tab: "course",
                          route: item,
                          openOverlay: true,
                          from: "courseList",
                          sectionType,
                          activeTab,
                        },
                      })
                    }
                  >
                    <RouteCard
                      route={item as RouteItem}
                      showDeleteButton={true}
                      onDelete={handleDeleteRoute}
                    />
                  </div>
                );
              }
              // 찜한 경로 등
              if (sectionType === "wishlist") {
                return (
                  <div
                    key={(item as RouteItem).routeIdx}
                    onClick={() =>
                      navigate("/map", {
                        state: {
                          tab: "course",
                          route: item,
                          openOverlay: true,
                          from: "courseList",
                          sectionType,
                          activeTab,
                        },
                      })
                    }
                  >
                    <RouteCard route={item as RouteItem} />
                  </div>
                );
              }
              return null;
            })
          ) : (
            <div className="no-course-message">
              {sectionType === "mycourse" && activeTab === "mycourse" && (
                <>
                  <p>저장한 경로가 없습니다.</p>
                  <p>지금 바로 기록해보세요!</p>
                  <div
                    className="no_btn btn_one"
                    onClick={() => navigate("/map")}
                  >
                    경로 그리기
                  </div>
                </>
              )}
              {sectionType === "mycourse" && activeTab === "myruns" && (
                <>
                  <p>러닝 기록이 없습니다.</p>
                  <p>지금 바로 달려보세요!</p>
                  <div
                    className="no_btn btn_one"
                    onClick={() => navigate("/map")}
                  >
                    러닝 시작하기
                  </div>
                </>
              )}
              {sectionType === "wishlist" && (
                <>
                  <p>찜한 경로가 없습니다.</p>
                  <p>지금 바로 저장해보세요!</p>
                  <div
                    className="no_btn btn_one"
                    onClick={() => navigate("/community")}
                  >
                    커뮤니티 가기
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseList;
