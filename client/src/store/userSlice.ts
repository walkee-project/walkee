import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { api, fetchUserSummary, fetchAllRoutes } from "../utils/api";

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
  userRoute: any[];
  userRouteLikeRaw?: any[];
  userRouteLike: any[];
  userPost: any[];
}

interface routeSummary {
  allRoute: any[];
}

interface UserState {
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
  summary: UserSummary | null; // summary 추가
  allRoute: routeSummary["allRoute"]; // 전체 경로 리스트 타입 지정
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  summary: null, // summary 초기값
  allRoute: [], // 초기값
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
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
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
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
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
      .addCase(fetchUserSummaryThunk.pending, (state) => {
        // summary 로딩 상태를 따로 두고 싶으면 추가 가능
      })
      .addCase(fetchUserSummaryThunk.fulfilled, (state, action) => {
        state.summary = action.payload;
      })
      .addCase(fetchUserSummaryThunk.rejected, (state, action) => {
        state.summary = null;
      })
      // fetchAllRouteThunk 액션 처리
      .addCase(fetchAllRouteThunk.pending, (state) => {
        // allRoute 로딩 상태를 따로 두고 싶으면 추가 가능
      })
      .addCase(fetchAllRouteThunk.fulfilled, (state, action) => {
        state.allRoute = action.payload;
      })
      .addCase(fetchAllRouteThunk.rejected, (state, action) => {
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
      });
  },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
