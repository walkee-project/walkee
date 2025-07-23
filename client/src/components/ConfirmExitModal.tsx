import "./css/ConfirmExitModal.css";

interface Props {
  where: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmExitModal = ({ where, onCancel, onConfirm }: Props) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <p className="modal-text">
          {where === "Community"
            ? "지금 나가면 작성한 내용이 사라집니다."
            : where === "map"
            ? "지금 나가면 경로가 저장이 불가합니다."
            : "1km 이내의 경로는 저장이 불가합니다."}
        </p>
        <div className="modal-buttons">
          <button className="modal-exit" onClick={onConfirm}>
            나가기
          </button>
          <button className="modal-cancel" onClick={onCancel}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmExitModal;
