export default function AccessPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-ryokan-green text-center mb-2">アクセス</h1>
      <p className="text-center text-sm text-gray-500 mb-12">Access</p>

      <div className="bg-white border border-gray-200 rounded p-6 mb-8">
        <h2 className="font-serif text-xl text-ryokan-green mb-4">所在地</h2>
        <address className="not-italic text-sm text-gray-600 leading-relaxed mb-6">
          〒000-0000<br />
          長野県山ノ湯温泉1-1<br />
          TEL: 0000-00-0000<br />
          FAX: 0000-00-0001
        </address>

        <div className="rounded overflow-hidden mb-6 border border-gray-200" style={{ height: '360px' }}>
          <iframe
            title="山の湯 花結 地図"
            src="https://www.openstreetmap.org/export/embed.html?bbox=138.3787%2C36.7188%2C138.4587%2C36.7788&layer=mapnik&marker=36.7488%2C138.4187"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>
        <p className="text-xs text-gray-400 mb-6 text-right">
          © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">OpenStreetMap</a> contributors
        </p>

        <h3 className="font-serif text-lg text-ryokan-green mb-3">交通案内</h3>
        <ul className="text-sm text-gray-600 space-y-3">
          <li className="flex gap-3">
            <span className="font-medium text-ryokan-green whitespace-nowrap">電車</span>
            <span>〇〇線「山ノ湯駅」下車、送迎バスにて約15分（要予約）</span>
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-ryokan-green whitespace-nowrap">お車</span>
            <span>〇〇IC より約30分。無料駐車場あり（20台）</span>
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-ryokan-green whitespace-nowrap">送迎</span>
            <span>山ノ湯駅より無料送迎あり（要事前連絡）</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
