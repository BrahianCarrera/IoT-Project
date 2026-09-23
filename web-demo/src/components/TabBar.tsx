import MdiIcon from "@/components/Icon";

export type TabKey = "inicio" | "historial" | "control";

const TABS: Array<{ key: TabKey; label: string; icon: string }> = [
  { key: "inicio", label: "Inicio", icon: "home" },
  { key: "historial", label: "Historial", icon: "history" },
  { key: "control", label: "Control", icon: "pipe-valve" },
];

interface TabBarProps {
  active: TabKey;
  onChange: (key: TabKey) => void;
}

export default function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="tabbar">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            className={
              "tabbar__item" + (isActive ? " tabbar__item--active" : "")
            }
            aria-current={isActive ? "page" : undefined}
            onClick={() => onChange(tab.key)}
          >
            <MdiIcon name={tab.icon} size={24} />
            <span className="tabbar__label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
