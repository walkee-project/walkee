import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { api, fetchUserSummary, fetchAllRoutes } from "../utils/api";
import type { RouteItem } from "../components/types/courseList_type";
import type { Post } from "../components/community/Community_all";

interface UserInfo {
  userIdx: number;
  userProvider: string;
  userId: string;
  userEmail: string;
  userName: string;
  userProfile: string;
  userPoint: number;
  userCreatedAt: string; // 가입일
}

// UserSummary 타입 추가
interface UserSummary {
  userRoute: RouteItem[];
  userRouteLikeRaw?: RouteItem[];
  userRouteLike: RouteItem[];
  userPost: Post[];
}

interface routeSummary {
  allRoute: RouteItem[];
}

interface UserState {
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
  summary: UserSummary | null; // summary 추가
  allRoute: routeSummary["allRoute"]; // 전체 경로 리스트 타입 지정
  recommendRoute: RouteItem | null; // 추천 경로 추가
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  summary: null, // summary 초기값
  allRoute: [], // 초기값
  recommendRoute: null, // 추천 경로 초기값
};

// 비동기 액션: 사용자 정보 가져오기
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await api.getUserInfo();
      return userData;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

// 비동기 액션: 유저 summary(마이페이지 요약) 가져오기
export const fetchUserSummaryThunk = createAsyncThunk(
  "user/fetchUserSummary",
  async (userIdx: number, { rejectWithValue }) => {
    try {
      const data = await fetchUserSummary(userIdx);
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

// 비동기 액션: 로그아웃
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.logout();
      return null;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

// 비동기 액션: 전체 경로 가져오기
export const fetchAllRouteThunk = createAsyncThunk(
  "user/fetchAllRoute",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAllRoutes();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

// 찜 추가/삭제 thunk
export const addRouteLikeThunk = createAsyncThunk(
  "user/addRouteLike",
  async (
    { userIdx, routeIdx }: { userIdx: number; routeIdx: number },
    { rejectWithValue }
  ) => {
    try {
      await api.addRouteLike(userIdx, routeIdx);
      return routeIdx;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const removeRouteLikeThunk = createAsyncThunk(
  "user/removeRouteLike",
  async (
    { userIdx, routeIdx }: { userIdx: number; routeIdx: number },
    { rejectWithValue }
  ) => {
    try {
      await api.removeRouteLike(userIdx, routeIdx);
      return routeIdx;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserInfo>) => {
      state.user = action.payload;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.error = null;
      state.summary = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUser 액션 처리
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload as string;
      })
      // fetchUserSummaryThunk 액션 처리
      .addCase(fetchUserSummaryThunk.pending, () => {
        // summary 로딩 상태를 따로 두고 싶으면 추가 가능
      })
      .addCase(fetchUserSummaryThunk.fulfilled, (state, action) => {
        state.summary = action.payload;
      })
      .addCase(fetchUserSummaryThunk.rejected, (state) => {
        state.summary = null;
      })
      // fetchAllRouteThunk 액션 처리
      .addCase(fetchAllRouteThunk.pending, () => {
        // allRoute 로딩 상태를 따로 두고 싶으면 추가 가능
      })
      .addCase(fetchAllRouteThunk.fulfilled, (state, action) => {
        state.allRoute = action.payload;
        // recommendRoute가 null일 때만 한 번만 계산
        if (
          state.recommendRoute === null &&
          action.payload &&
          action.payload.length > 0
        ) {
          state.recommendRoute =
            action.payload[Math.floor(Math.random() * action.payload.length)];
        }
      })
      .addCase(fetchAllRouteThunk.rejected, (state) => {
        state.allRoute = [];
      })
      // logoutUser 액션 처리
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
        state.summary = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 찜 추가/삭제 처리
      .addCase(addRouteLikeThunk.fulfilled, (state, action) => {
        if (state.summary && state.summary.userRouteLike) {
          // 이미 있으면 중복 추가 방지
          if (
            !state.summary.userRouteLike.some(
              (item: RouteItem) => item.routeIdx === action.payload
            )
          ) {
            state.summary.userRouteLike.push({
              routeIdx: action.payload,
            } as RouteItem);
          }
        }
      })
      .addCase(removeRouteLikeThunk.fulfilled, (state, action) => {
        if (state.summary && state.summary.userRouteLike) {
          state.summary.userRouteLike = state.summary.userRouteLike.filter(
            (item: RouteItem) => item.routeIdx !== action.payload
          );
        }
      });
  },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
