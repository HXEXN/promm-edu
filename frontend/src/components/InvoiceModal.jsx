import { useRef, useEffect } from 'react';
import './InvoiceModal.css';

function InvoiceModal({ trainingPlan, onClose, onConfirm }) {
    const modalRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const today = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const taxAmount = trainingPlan.summary.totalCost * 0.1;
    const finalAmount = trainingPlan.summary.totalCost + taxAmount;

    return (
        <div className="invoice-overlay">
            <div className="invoice-modal" ref={modalRef}>
                <div className="invoice-header">
                    <div className="invoice-brand">PROMM Enterprise</div>
                    <div className="invoice-title">INVOICE</div>
                </div>

                <div className="invoice-meta">
                    <div className="meta-group">
                        <label>Date:</label>
                        <span>{today}</span>
                    </div>
                    <div className="meta-group">
                        <label>Invoice #:</label>
                        <span>INV-{Date.now().toString().slice(-6)}</span>
                    </div>
                </div>

                <div className="invoice-bill-to">
                    <label>Bill To:</label>
                    <p>Enterprise Client (Demo Corp)</p>
                </div>

                <div className="invoice-items">
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th className="text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <strong>Prompt Engineering Corporate Training</strong>
                                    <p className="item-desc">
                                        Total Modules: {trainingPlan.summary.totalModules} ea<br />
                                        Duration: {trainingPlan.summary.recommendedWeeks} weeks
                                    </p>
                                </td>
                                <td className="text-right">{formatCurrency(trainingPlan.summary.totalCost)}</td>
                            </tr>
                            <tr>
                                <td>Platform Access & Setup Fee</td>
                                <td className="text-right">$0 (Included)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="invoice-total">
                    <div className="total-row">
                        <span>Subtotal</span>
                        <span>{formatCurrency(trainingPlan.summary.totalCost)}</span>
                    </div>
                    <div className="total-row">
                        <span>Tax (10%)</span>
                        <span>{formatCurrency(taxAmount)}</span>
                    </div>
                    <div className="total-row final">
                        <span>Total Due</span>
                        <span>{formatCurrency(finalAmount)}</span>
                    </div>
                </div>

                <div className="invoice-notice">
                    <p>
                        위 견적 내용을 확인하였으며, 이에 동의하고 교육 프로그램을 시행합니다.<br />
                        (본 문서는 시뮬레이션용이며 실제 결제는 이루어지지 않습니다)
                    </p>
                </div>

                <div className="invoice-actions">
                    <button className="btn-text-only" onClick={onClose}>취소</button>
                    <button className="btn-primary" onClick={onConfirm}>
                        ✅ 승인 및 진행 (Approve)
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InvoiceModal;
