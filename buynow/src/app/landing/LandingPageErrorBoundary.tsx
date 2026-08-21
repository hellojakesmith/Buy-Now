import { Component, type ErrorInfo, type ReactNode } from "react";

export default class LandingPageErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Landing page builder crashed", error, info);
  }

  reset = () => {
    this.setState({ error: null });
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#F7F8FC] p-5">
        <div className="w-full max-w-md rounded-[28px] border border-[#EEF0F5] bg-white p-6 text-center shadow-2xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2] text-[#B91C1C]">!</div>
          <h2 className="mt-4 text-[20px] font-black text-[#111111]">We couldn't open your landing page</h2>
          <p className="mt-2 text-[13px] leading-5 text-[#6B7280]">Your page was saved, but the editor hit an unexpected error. Refresh the app and try opening the page again.</p>
          <button type="button" onClick={this.reset} className="mt-5 w-full rounded-2xl bg-[#0325D9] px-4 py-3.5 text-[14px] font-black text-white">Reload Buy Now</button>
        </div>
      </div>
    );
  }
}
