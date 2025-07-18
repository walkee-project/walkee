import "../css/ConfirmExitModal.css";

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmExitModal = ({ onCancel, onConfirm }: Props) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <p className="modal-text">지금 나가면 작성한 내용이 사라집니다.</p>
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
